<?php

namespace Tests\Unit\Http\Controllers\Auth;

use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use Mockery;

class VerifyEmailControllerTest extends TestCase
{
    use RefreshDatabase;

    private $controller;
    private $frontendUrl;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Set frontend URL for testing
        $this->frontendUrl = 'http://localhost:3000';
        Config::set('app.frontend_url', $this->frontendUrl);
        
        // Initialize controller
        $this->controller = new VerifyEmailController();
    }

    public function test_already_verified_user_gets_redirected()
    {
        // Arrange: Create mock user
        $verifiedUser = Mockery::mock('App\Models\User');
        $verifiedUser->shouldReceive('hasVerifiedEmail')
                     ->once()
                     ->andReturn(true);
        
        // Create mock request
        $request = Mockery::mock(EmailVerificationRequest::class);
        $request->shouldReceive('user')
                ->andReturn($verifiedUser);
        
        // Act: Call the controller
        $response = $this->controller->__invoke($request);
        
        // Assert: Check redirect
        $this->assertEquals(
            $this->frontendUrl . '/dashboard?verified=1',
            $response->getTargetUrl()
        );
    }

    public function test_user_gets_verified_and_event_fired()
    {
        Event::fake();
        
        // Arrange: Create mock user
        $unverifiedUser = Mockery::mock('App\Models\User');
        
        // Set expectations for hasVerifiedEmail and markEmailAsVerified
        $unverifiedUser->shouldReceive('hasVerifiedEmail')
                       ->once()
                       ->andReturn(false);
            
        $unverifiedUser->shouldReceive('markEmailAsVerified')
                       ->once()
                       ->andReturn(true);
        
        // Set up ID property for event checking
        // Instead of setting directly, mock getAttribute method
        $unverifiedUser->shouldReceive('getAttribute')
                       ->with('id')
                       ->andReturn(123);
        
        // Create mock request
        $request = Mockery::mock(EmailVerificationRequest::class);
        $request->shouldReceive('user')
                ->andReturn($unverifiedUser);
        
        // Act: Call the controller
        $response = $this->controller->__invoke($request);
        
        // Assert: Check redirect
        $this->assertEquals(
            $this->frontendUrl . '/dashboard?verified=1',
            $response->getTargetUrl()
        );
        
        // Assert: Check event
        Event::assertDispatched(Verified::class, function ($event) {
            return $event->user->id === 123;
        });
    }
    
    public function test_verification_link_works_with_valid_signature()
    {
        // Create an unverified user for the actual test
        $unverifiedUser = User::factory()->create([
            'email_verified_at' => null
        ]);
        
        // Generate a signed verification URL
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(60),
            [
                'id' => $unverifiedUser->id,
                'hash' => sha1($unverifiedUser->email)
            ]
        );
        
        // Make sure the frontend URL is set
        Config::set('app.frontend_url', $this->frontendUrl);
        
        // Act: Visit the verification URL while authenticated as the unverified user
        $response = $this->actingAs($unverifiedUser)
            ->get($verificationUrl);
        
        // Assert: Should redirect to frontend with verified=1
        $response->assertRedirect($this->frontendUrl . '/dashboard?verified=1');
        
        // Refresh user and check verification status
        $unverifiedUser->refresh();
        $this->assertNotNull($unverifiedUser->email_verified_at);
    }

    public function test_verification_link_fails_with_invalid_signature()
    {
        // Create an unverified user for the actual test
        $unverifiedUser = User::factory()->create([
            'email_verified_at' => null
        ]);
        
        // Generate a verification URL but modify the signature
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(60),
            [
                'id' => $unverifiedUser->id,
                'hash' => sha1($unverifiedUser->email)
            ]
        );
        
        // Corrupt the signature
        $invalidUrl = str_replace('signature=', 'signature=invalid', $verificationUrl);
        
        // Act: Visit the invalid verification URL
        $response = $this->actingAs($unverifiedUser)
            ->get($invalidUrl);
        
        // Assert: Should get an error (403 forbidden for invalid signature)
        $response->assertStatus(403);
        
        // User should still be unverified
        $unverifiedUser->refresh();
        $this->assertNull($unverifiedUser->email_verified_at);
    }

    public function test_verification_link_fails_for_wrong_user()
    {
        // Create two unverified users
        $userOne = User::factory()->create(['email_verified_at' => null]);
        $userTwo = User::factory()->create(['email_verified_at' => null]);
        
        // Generate a verification URL for the first user
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(60),
            [
                'id' => $userOne->id,
                'hash' => sha1($userOne->email)
            ]
        );
        
        // Act: Try to use the link while authenticated as a different user
        $response = $this->actingAs($userTwo)
            ->get($verificationUrl);
        
        // Assert: Should be forbidden (403)
        $response->assertStatus(403);
        
        // Both users should still be unverified
        $userOne->refresh();
        $userTwo->refresh();
        $this->assertNull($userOne->email_verified_at);
        $this->assertNull($userTwo->email_verified_at);
    }

    protected function tearDown(): void
    {
        // Clean up Mockery
        Mockery::close();
        
        parent::tearDown();
    }
}
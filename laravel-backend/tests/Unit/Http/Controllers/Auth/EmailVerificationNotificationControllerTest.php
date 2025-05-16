<?php

namespace Tests\Unit\Http\Controllers\Auth;

use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Notification;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Str;

class EmailVerificationNotificationControllerTest extends TestCase
{
    use RefreshDatabase;

    private $verifiedUser;
    private $unverifiedUser;
    private $controller;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->verifiedUser = User::factory()->create([
            'email' => 'verified'.Str::random(3).'@northeastern.edu',
            'email_verified_at' => now()
        ]);
        
        $this->unverifiedUser = User::factory()->create([
            'email' => 'unverified'.Str::random(3).'@northeastern.edu',
            'email_verified_at' => null
        ]);
        
        $this->controller = new EmailVerificationNotificationController();
    }

    public function test_verification_notification_endpoint_for_verified_user()
    {
        $response = $this->actingAs($this->verifiedUser)
            ->postJson('/api/email/verification-notification');
        
        $response->assertStatus(200);
        $response->assertJsonFragment(['message' => 'Already verified']);
    }

    public function test_verification_notification_endpoint_for_unverified_user()
    {
        Notification::fake();
        
        $response = $this->actingAs($this->unverifiedUser)
            ->postJson('/api/email/verification-notification');
        
        $response->assertStatus(202)
            ->assertJson(['message' => 'Verification link sent']);
        
        Notification::assertSentTo(
            $this->unverifiedUser,
            VerifyEmail::class
        );
    }

    public function test_verification_notification_requires_authentication()
    {
        $response = $this->postJson('/api/email/verification-notification');
        
        $response->assertStatus(401);
    }
}
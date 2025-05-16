<?php

namespace Tests\Unit\Http\Requests\Auth;

use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;
use App\Models\User;

class LoginRequestTest extends TestCase
{
    use RefreshDatabase;

    private $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a test user
        $this->user = User::factory()->create([
            'email' => 'test@northeastern.edu',
            'password' => bcrypt('password123'),
        ]);
        
        // Clear any rate limiting
        RateLimiter::clear('test@northeastern.edu|127.0.0.1');
    }

    public function test_login_request_validates_with_valid_data()
    {
        $request = LoginRequest::create('/login', 'POST', [
            'email' => 'test@northeastern.edu',
            'password' => 'password123',
        ]);
        
        $request->setContainer($this->app);
        
        $this->assertTrue($request->authorize());
        
        // Get validation rules
        $rules = $request->rules();
        
        // Check that both email and password are required
        $this->assertArrayHasKey('email', $rules);
        $this->assertArrayHasKey('password', $rules);
    }

    public function test_authenticate_method_succeeds_with_valid_credentials()
    {
        // Create a login request with valid credentials
        $request = LoginRequest::create('/login', 'POST', [
            'email' => 'test@northeastern.edu',
            'password' => 'password123',
        ], [], [], [
            'REMOTE_ADDR' => '127.0.0.1'
        ]);
        
        $request->setContainer($this->app);
        
        // Authenticate should not throw an exception
        try {
            $request->authenticate();
            $this->assertTrue(true); // No exception means success
        } catch (ValidationException $e) {
            $this->fail('Authentication failed with valid credentials: ' . json_encode($e->errors()));
        }
        
        // Check that rate limiting was cleared
        $this->assertEquals(
            0, 
            RateLimiter::attempts($request->throttleKey())
        );
        
        // User should be authenticated
        $this->assertTrue(Auth::check());
        $this->assertEquals($this->user->id, Auth::id());
    }

    public function test_authenticate_method_fails_with_invalid_credentials()
    {
        // Create a login request with invalid credentials
        $request = LoginRequest::create('/login', 'POST', [
            'email' => 'test@northeastern.edu',
            'password' => 'wrongpassword',
        ], [], [], [
            'REMOTE_ADDR' => '127.0.0.1'
        ]);
        
        $request->setContainer($this->app);
        
        // Authenticate should throw ValidationException
        $this->expectException(ValidationException::class);
        
        try {
            $request->authenticate();
        } catch (ValidationException $e) {
            // Check error message
            $this->assertArrayHasKey('email', $e->errors());
            
            // Check that rate limiting was increased
            $this->assertEquals(
                1, 
                RateLimiter::attempts($request->throttleKey())
            );
            
            // User should not be authenticated
            $this->assertFalse(Auth::check());
            
            throw $e; // Re-throw to satisfy expectException
        }
    }

    public function test_rate_limiting_kicks_in_after_too_many_attempts()
    {
        Event::fake();
        
        // Create a login request
        $request = LoginRequest::create('/login', 'POST', [
            'email' => 'test@northeastern.edu',
            'password' => 'wrongpassword',
        ], [], [], [
            'REMOTE_ADDR' => '127.0.0.1'
        ]);
        
        $request->setContainer($this->app);
        
        // Simulate 5 failed attempts
        for ($i = 0; $i < 5; $i++) {
            RateLimiter::hit($request->throttleKey());
        }
        
        // The 6th attempt should trigger rate limiting
        $this->expectException(ValidationException::class);
        
        try {
            $request->ensureIsNotRateLimited();
        } catch (ValidationException $e) {
            // Check that Lockout event was fired
            Event::assertDispatched(Lockout::class);
            
            // Check error message contains expected text
            $this->assertArrayHasKey('email', $e->errors());
            $this->assertStringContainsString(
                'Too many login attempts', 
                $e->errors()['email'][0]
            );
            
            throw $e; // Re-throw to satisfy expectException
        }
    }

    public function test_throttle_key_format()
    {
        // Create a login request
        $request = LoginRequest::create('/login', 'POST', [
            'email' => 'Test.User@northeastern.edu', // Mixed case and dot
        ], [], [], [
            'REMOTE_ADDR' => '192.168.1.1'
        ]);
        
        $request->setContainer($this->app);
        
        // Check throttle key format
        $throttleKey = $request->throttleKey();
        
        // Key should be lowercase and include IP
        $this->assertEquals(
            'test.user@northeastern.edu|192.168.1.1', 
            $throttleKey
        );
    }

    protected function tearDown(): void
    {
        // Clear rate limiting after tests
        RateLimiter::clear('test@northeastern.edu|127.0.0.1');
        
        parent::tearDown();
    }
}
<?php

namespace Tests\Unit\Http\Middleware;

use App\Http\Middleware\EnsureEmailIsVerified;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Mockery;
use Closure;

class EnsureEmailIsVerifiedTest extends TestCase
{
    use RefreshDatabase;
    
    private $middleware;
    
    protected function setUp(): void
    {
        parent::setUp();
        
        $this->middleware = new EnsureEmailIsVerified();
    }
    
    public function test_unauthenticated_request_is_rejected()
    {
        // Arrange: Create a request with no authenticated user
        $request = new Request();
        
        // Create a mock closure that should not be called
        $next = function ($request) {
            $this->fail('Next middleware should not be called');
        };
        
        // Act: Pass the request through the middleware
        $response = $this->middleware->handle($request, $next);
        
        // Assert: Check response
        $this->assertEquals(409, $response->getStatusCode());
        $this->assertEquals(
            ['message' => 'Your email address is not verified.'],
            json_decode($response->getContent(), true)
        );
    }
    
    public function test_unverified_email_request_is_rejected()
    {
        // Create a real unverified user since User implements MustVerifyEmail
        $user = User::factory()->create([
            'email_verified_at' => null
        ]);
        
        // Create a request with this user
        $request = new Request();
        $request->setUserResolver(function () use ($user) {
            return $user;
        });
        
        // Create a mock closure that should not be called
        $next = function ($request) {
            $this->fail('Next middleware should not be called');
        };
        
        // Act: Pass the request through the middleware
        $response = $this->middleware->handle($request, $next);
        
        // Assert: Check response
        $this->assertEquals(409, $response->getStatusCode());
        $this->assertEquals(
            ['message' => 'Your email address is not verified.'],
            json_decode($response->getContent(), true)
        );
    }
    
    public function test_verified_email_request_passes_through()
    {
        // Create a real verified user
        $user = User::factory()->create([
            'email_verified_at' => now()
        ]);
        
        // Create a request with this user
        $request = new Request();
        $request->setUserResolver(function () use ($user) {
            return $user;
        });
        
        // Create a mock response that we expect to be returned
        $expectedResponse = response('Test response');
        
        // Create a mock closure that returns our expected response
        $next = function ($request) use ($expectedResponse) {
            return $expectedResponse;
        };
        
        // Act: Pass the request through the middleware
        $response = $this->middleware->handle($request, $next);
        
        // Assert: Check that we got the expected response back
        $this->assertSame($expectedResponse, $response);
    }
    
    public function test_middleware_in_actual_routes()
    {
        // Create a verified user
        $verifiedUser = User::factory()->create([
            'email_verified_at' => now()
        ]);
        
        // Create an unverified user
        $unverifiedUser = User::factory()->create([
            'email_verified_at' => null
        ]);
        
        // Test with unverified user accessing a protected route
        $response = $this->actingAs($unverifiedUser)
                         ->getJson('/api/v1/projects'); // Using a real route from your application
        
        // Should be denied access - accepting either 403 or 409 status code
        $this->assertTrue(
            $response->status() == 403 || $response->status() == 409,
            'Expected status code 403 or 409, got ' . $response->status()
        );
        
        // Test the auth-status endpoint
        $response = $this->actingAs($unverifiedUser)
                         ->getJson('/api/auth-status');
        
        // Should return authentication info
        $response->assertStatus(200)
                 ->assertJson([
                     'authenticated' => true,
                     'email_verified' => false
                 ]);
        
        // Test with verified user
        $response = $this->actingAs($verifiedUser)
                         ->getJson('/api/v1/projects');
        
        // Should be able to access protected route
        $response->assertStatus(200);
    }
    
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
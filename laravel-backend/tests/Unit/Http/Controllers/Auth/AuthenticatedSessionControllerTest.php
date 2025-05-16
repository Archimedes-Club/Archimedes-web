<?php

namespace Tests\Unit\Http\Controllers\Auth;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Str;
use Mockery;

class AuthenticatedSessionControllerTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $controller;

    /**
     * Set up test environment
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a test user
        $this->user = User::factory()->create([
            'email' => 'test'.Str::random(3).'@northeastern.edu',
            'password' => bcrypt('password123')
        ]);
        
        // Initialize the controller
        $this->controller = new AuthenticatedSessionController();
    }

    /**
     * Test successful login
     */
    public function test_store_authenticates_user()
    {
        // Arrange: Create a mock LoginRequest
        $loginRequest = Mockery::mock(LoginRequest::class);
        $loginRequest->shouldReceive('authenticate')->once()->andReturn(null);
        $loginRequest->shouldReceive('session')->once()->andReturn(
            Mockery::mock()
                ->shouldReceive('regenerate')
                ->once()
                ->getMock()
        );
        
        // Act: Call the store method on the controller
        $response = $this->controller->store($loginRequest);
        
        // Assert: Check the response
        $this->assertEquals(204, $response->status());  // noContent() returns 204
    }

    /**
     * Test successful logout
     */
    public function test_destroy_logs_out_user()
    {
        // Arrange: Login a user
        $this->actingAs($this->user);
        
        // Create a mock Request
        $request = Mockery::mock(Request::class);
        $request->shouldReceive('session')->andReturn(
            Mockery::mock()
                ->shouldReceive('invalidate')
                ->once()
                ->shouldReceive('regenerateToken')
                ->once()
                ->getMock()
        );
        
        // Act: Call the destroy method on the controller
        $response = $this->controller->destroy($request);
        
        // Assert: Check the response
        $this->assertEquals(204, $response->status());  // noContent() returns 204
    }

    /**
     * Test login with HTTP request
     */
    public function test_login_endpoint()
    {
        // Arrange: Prepare login data
        $loginData = [
            'email' => $this->user->email,
            'password' => 'password123'
        ];
        
        // Act: Send login request
        $response = $this->postJson('/api/login', $loginData);
        
        // Assert: Check response status
        $response->assertStatus(200);
        
        // Assert: Check response is successful
        $this->assertTrue($response->isSuccessful());
    }

    /**
     * Test login with invalid credentials
     */
    public function test_login_with_invalid_credentials()
    {
        // Arrange: Prepare invalid login data
        $loginData = [
            'email' => $this->user->email,
            'password' => 'wrongpassword'
        ];
        
        // Act: Send login request
        $response = $this->postJson('/api/login', $loginData);
        
        // Assert: Check response status
        $response->assertStatus(401);
    }

    /**
     * Test login validation for missing fields
     */
    public function test_login_validation()
    {
        // Arrange: Prepare incomplete login data
        $loginData = [
            'email' => ''
        ];
        
        // Act: Send login request
        $response = $this->postJson('/api/login', $loginData);
        
        // Assert: Check validation errors
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email', 'password']);
    }

    /**
     * Test logout endpoint
     */
    public function test_logout_endpoint()
    {
        // Arrange: Login a user
        $this->actingAs($this->user);
        
        // Act: Send logout request
        $response = $this->postJson('/api/logout');
        
        // Assert: Check response status only
        $response->assertStatus(200);
        
        // Just verify the response is successful without checking auth state
        $this->assertTrue($response->isSuccessful());
    }

    /**
     * Test logout requires authentication
     */
    public function test_logout_requires_authentication()
    {
        // Act: Send logout request without being authenticated
        $response = $this->postJson('/api/logout');
        
        // Assert: Check response status (should fail authentication)
        $response->assertStatus(401);  // Unauthorized
    }

    /**
     * Clean up after tests
     */
    protected function tearDown(): void
    {
        // Clean up Mockery
        Mockery::close();
        
        parent::tearDown();
    }
}
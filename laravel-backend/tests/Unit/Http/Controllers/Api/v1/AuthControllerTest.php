<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the register endpoint creates a user and returns a token.
     */
    public function test_register_creates_user_and_returns_token()
    {
        $data = [
            'name'                  => 'Test User',
            'email'                 => 'testuser@northeastern.edu',
            'password'              => 'password',
            'password_confirmation' => 'password',
            'phone'                 => '1234567890',
            'linkedin_url'          => 'https://linkedin.com/in/testuser',
            'role'                  => 'student',
        ];

        $response = $this->postJson('/api/auth/register', $data);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'user' => ['id', 'name', 'email', 'phone', 'linkedin_url', 'role'],
                     'token',
                     'message',
                 ])
                 ->assertJson(['message' => 'User registered successfully']);

        $this->assertDatabaseHas('users', [
            'email' => 'testuser@northeastern.edu',
        ]);
    }

    /**
     * Test that the login endpoint returns a token when credentials are valid.
     */
    public function test_login_successful()
    {
        $password = 'password';
        $user = User::factory()->create([
            'email'    => 'testuser@northeastern.edu',
            'password' => Hash::make($password),
        ]);

        $data = [
            'email'    => 'testuser@northeastern.edu',
            'password' => $password,
        ];

        $response = $this->postJson('/api/auth/login', $data);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'user' => ['id', 'name', 'email', 'phone', 'linkedin_url', 'role'],
                     'token',
                     'message',
                 ])
                 ->assertJson(['message' => 'Login successful']);
    }

    /**
     * Test that the login endpoint fails when provided invalid credentials.
     */
    public function test_login_fails_with_invalid_credentials()
    {
        $password = 'password';
        $user = User::factory()->create([
            'email'    => 'testuser@northeastern.edu',
            'password' => Hash::make($password),
        ]);

        $data = [
            'email'    => 'testuser@northeastern.edu',
            'password' => 'wrongpassword',
        ];

        $response = $this->postJson('/api/auth/login', $data);

        // Since the controller throws a ValidationException on failure,
        // we expect a 422 Unprocessable Entity status with an error message for the email field.
        $response->assertStatus(422)
                 ->assertJsonValidationErrors('email');
    }

    /**
     * Test that the logout endpoint deletes tokens and returns a success message.
     */
    public function test_logout_successful()
    {
        // Create a user and generate a token.
        $user = User::factory()->create([
            'name' => 'Test User'
        ]);
        $user->createToken($user->name);

        // Authenticate using Sanctum.
        Sanctum::actingAs($user, ['*']);

        $response = $this->postJson('/api/auth/logout');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Test User logged out successfully']);

        // Ensure that the user's tokens are deleted.
        $this->assertCount(0, $user->fresh()->tokens);
    }
}

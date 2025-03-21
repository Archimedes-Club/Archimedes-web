<?php

namespace Tests\Unit\Http\Controllers\Api\v1;

use App\Http\Controllers\Api\v1\AuthController;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_registration()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'test@northeastern.edu',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '1234567890',
            'linkedin_url' => 'https://linkedin.com/in/test',
            'role' => 'student'
        ];

        $response = $this->postJson('/api/v1/auth/register', $userData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'user',
                'token',
                'message'
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@northeastern.edu',
            'name' => 'Test User'
        ]);
    }

    public function test_user_registration_with_invalid_data()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'invalid-email',
            'password' => '123', // too short
            'password_confirmation' => '123',
            'phone' => '1234567890',
            'linkedin_url' => 'invalid-url',
            'role' => 'invalid-role'
        ];

        $response = $this->postJson('/api/v1/auth/register', $userData);

        $response->assertStatus(400)
            ->assertJsonValidationErrors(['email', 'password', 'linkedin_url', 'role']);
    }

    public function test_user_login()
    {
        $user = User::factory()->create([
            'email' => 'test@northeastern.edu',
            'password' => Hash::make('password123')
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@northeastern.edu',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'user',
                'token',
                'message'
            ]);
    }

    public function test_user_login_with_invalid_credentials()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@northeastern.edu',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Invalid credentials'
            ]);
    }

    public function test_user_logout()
    {
        $user = User::factory()->create([
            'email' => 'test@northeastern.edu'
        ]);
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/v1/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'message' => "{$user->name} logged out successfully"
            ]);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id
        ]);
    }
} 
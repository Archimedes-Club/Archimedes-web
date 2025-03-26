<?php

namespace Tests\Unit\Http\Controllers\Api\v1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_registration_success()
    {
        $userData = [
            'name'                  => 'Test User',
            'email'                 => 'test@northeastern.edu',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'phone'                 => '1234567890',
            'linkedin_url'          => 'https://linkedin.com/in/testuser',
            'role'                  => 'student'
        ];

        $response = $this->postJson('/api/register', $userData);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'user' => [
                         'id',
                         'name',
                         'email',
                         'phone',
                         'linkedin_url',
                         'role'
                     ],
                     'token',
                     'message'
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@northeastern.edu',
            'role'  => 'student'
        ]);
    }

    public function test_user_registration_invalid_data()
    {
        $userData = [
            'name'                  => 'Test User',
            'email'                 => 'invalid-email',
            'password'              => 'pass',
            'password_confirmation' => 'pass',
            'role'                  => 'student'
        ];

        // Expecting a 422 status code for validation errors
        $response = $this->postJson('/api/register', $userData);
        $response->assertStatus(422);
    }

    public function test_user_login_success()
    {
        $password = 'password123';
        $user = User::factory()->create([
            'email'    => 'test@northeastern.edu',
            'password' => Hash::make($password),
            'role'     => 'student'
        ]);

        $loginData = [
            'email'    => 'test@northeastern.edu',
            'password' => $password
        ];

        $response = $this->postJson('/api/login', $loginData);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'user' => [
                         'id',
                         'name',
                         'email',
                         'phone',
                         'linkedin_url',
                         'role'
                     ],
                     'token',
                     'message'
                 ]);
    }

    public function test_user_login_invalid_credentials()
    {
        $password = 'password123';
        $user = User::factory()->create([
            'email'    => 'test@northeastern.edu',
            'password' => Hash::make($password),
            'role'     => 'student'
        ]);

        $loginData = [
            'email'    => 'test@northeastern.edu',
            'password' => 'wrongpassword'
        ];

        // Expecting a 422 status code for invalid credentials (per Laravel's default behavior)
        $response = $this->postJson('/api/login', $loginData);
        $response->assertStatus(422);
    }

    public function test_user_logout_success()
    {
        $user = User::factory()->create([
            'email' => 'test@northeastern.edu',
            'role'  => 'student'
        ]);
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/v1/logout');

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => "{$user->name} logged out successfully"
                 ]);
    }
}

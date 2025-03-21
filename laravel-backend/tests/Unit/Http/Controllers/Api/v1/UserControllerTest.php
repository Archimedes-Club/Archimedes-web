<?php

namespace Tests\Unit\Http\Controllers\Api\v1;

use App\Http\Controllers\Api\v1\UserController;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    private $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create([
            'email' => 'test@northeastern.edu',
            'name' => 'Test User',
            'phone' => '1234567890',
            'linkedin_url' => 'https://linkedin.com/in/test',
            'role' => 'student'
        ]);
    }

    public function test_get_user_profile()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/v1/user');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'email',
                    'phone',
                    'linkedin_url',
                    'role',
                    'created_at',
                    'updated_at'
                ]
            ]);
    }

    public function test_update_user_profile()
    {
        $updateData = [
            'name' => 'Updated Name',
            'email' => 'updated@northeastern.edu',
            'phone' => '9876543210',
            'linkedin_url' => 'https://linkedin.com/in/updated'
        ];

        $response = $this->actingAs($this->user)
            ->putJson('/api/v1/user', $updateData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'update_user' => [
                    'data' => [
                        'id',
                        'name',
                        'email',
                        'phone',
                        'linkedin_url',
                        'role',
                        'created_at',
                        'updated_at'
                    ]
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'Updated Name',
            'email' => 'updated@northeastern.edu'
        ]);
    }

    public function test_update_user_profile_with_invalid_data()
    {
        $updateData = [
            'email' => 'invalid-email',
            'phone' => '123', // too short
            'linkedin_url' => 'invalid-url'
        ];

        $response = $this->actingAs($this->user)
            ->putJson('/api/v1/user', $updateData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'phone', 'linkedin_url']);
    }

    public function test_delete_user_account()
    {
        $response = $this->actingAs($this->user)
            ->deleteJson('/api/v1/user');

        $response->assertStatus(200)
            ->assertJson([
                'message' => "{$this->user->name} deleted and session logged out"
            ]);

        $this->assertDatabaseMissing('users', [
            'id' => $this->user->id
        ]);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $this->user->id
        ]);
    }
} 
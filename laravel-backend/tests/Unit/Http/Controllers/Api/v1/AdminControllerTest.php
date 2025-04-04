<?php

namespace Tests\Unit\Http\Controllers\Api\v1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class AdminControllerTest extends TestCase
{
    use RefreshDatabase;

    private $admin;

    protected function setUp(): void
    {
        parent::setUp();
        // Set the config value for admin emails
        Config::set('app.admins', ['admin@northeastern.edu']);
        
        // Create an admin user with role "admin"
        $this->admin = User::factory()->create([
            'email' => 'admin@northeastern.edu',
            'role'  => 'admin'
        ]);
    }
    
    public function test_get_all_users()
    {
        // Create 3 test users with a defined role (e.g., "student")
        for ($i = 0; $i < 3; $i++) {
            User::factory()->create([
                'email' => "user{$i}@northeastern.edu",
                'role'  => 'student'
            ]);
        }
        
        $response = $this->actingAs($this->admin, 'sanctum')
                         ->getJson('/api/v1/admin/users');

        // Expect 4 users: 3 test users plus 1 admin
        $response->assertStatus(200)
                 ->assertJsonCount(4, 'data');
    }

    public function test_get_all_users_as_non_admin()
    {
        $user = User::factory()->create([
            'email' => 'user@northeastern.edu',
            'role'  => 'student'
        ]);

        $response = $this->actingAs($user, 'sanctum')
                         ->getJson('/api/v1/admin/users');

        $response->assertStatus(403)
                 ->assertJson([
                     'message' => 'Access Denied. Admins only.'
                 ]);
    }

    public function test_update_user()
    {
        $user = User::factory()->create([
            'email' => 'test@northeastern.edu',
            'role'  => 'student'
        ]);
    
        $updateData = [
            'name'         => 'Updated Name',
            'email'        => 'updated@northeastern.edu',
            'phone'        => '9876543210',
            'linkedin_url' => 'https://linkedin.com/in/updated'
        ];
    
        $response = $this->actingAs($this->admin, 'sanctum')
                         ->putJson("/api/v1/admin/users/{$user->id}", $updateData);
    
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'message',
                     'update_user' => [
                         'id',
                         'name',
                         'email',
                         'phone',
                         'linkedin_url',
                         'role'
                     ]
                 ]);
    
        $this->assertDatabaseHas('users', [
            'id'    => $user->id,
            'name'  => 'Updated Name',
            'email' => 'updated@northeastern.edu'
        ]);
    }
    
    public function test_update_nonexistent_user()
    {
        $updateData = [
            'name'  => 'Updated Name',
            'email' => 'updated@northeastern.edu'
        ];

        $response = $this->actingAs($this->admin, 'sanctum')
                         ->putJson('/api/v1/admin/users/999', $updateData);

        $response->assertStatus(404)
                 ->assertJson([
                     'message' => 'User not found'
                 ]);
    }

    public function test_delete_user()
    {
        $user = User::factory()->create([
            'email' => 'test@northeastern.edu',
            'role'  => 'student'
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
                         ->deleteJson("/api/v1/admin/users/{$user->id}");

        $response->assertStatus(200)
         ->assertExactJson([]);

        $this->assertDatabaseMissing('users', [
            'id' => $user->id
        ]);
    }

    public function test_delete_nonexistent_user()
    {
        $response = $this->actingAs($this->admin, 'sanctum')
                         ->deleteJson('/api/v1/admin/users/999');

        $response->assertStatus(404)
                 ->assertJson([
                     'message' => 'User not found'
                 ]);
    }

    public function test_delete_user_as_non_admin()
    {
        $user = User::factory()->create([
            'email' => 'user@northeastern.edu',
            'role'  => 'student'
        ]);

        $targetUser = User::factory()->create([
            'email' => 'target@northeastern.edu',
            'role'  => 'student'
        ]);

        $response = $this->actingAs($user, 'sanctum')
                         ->deleteJson("/api/v1/admin/users/{$targetUser->id}");

        $response->assertStatus(403)
                 ->assertJson([
                     'message' => 'Access Denied. Admins only.'
                 ]);

        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id
        ]);
    }
}
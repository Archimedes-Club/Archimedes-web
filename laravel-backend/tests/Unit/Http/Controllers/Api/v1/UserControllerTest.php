<?php

namespace Tests\Unit\Http\Controllers\Api\v1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    private $user;

    /**
     * Set up test environment
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a test user
        $this->user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test'.Str::random(3).'@northeastern.edu', // Ensure email is unique
            'phone' => '1234567890',
            'linkedin_url' => 'https://linkedin.com/in/testuser'
        ]);
    }

    /**
     * Test getting authenticated user details
     */
    public function test_get_user_details()
    {
        // Act: Send request to get user details while authenticated
        $response = $this->actingAs($this->user)
            ->getJson('/api/v1/user');
        
        // Assert: Response should be successful and contain user details
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'email',
                    'phone',
                    'linkedin_url',
                    'role',
                ]
            ])
            ->assertJson([
                'data' => [
                    'id' => $this->user->id,
                    'name' => 'Test User',
                    'email' => $this->user->email
                ]
            ]);
    }

    /**
     * Test get user details without authentication should fail
     */
    public function test_get_user_details_unauthenticated()
    {
        // Act: Send request without being authenticated
        $response = $this->getJson('/api/v1/user');
        
        // Assert: Response should be unauthorized
        $response->assertStatus(401);
    }

    /**
     * Test updating user details with a new email
     */
    public function test_update_user_details()
    {
        // Arrange: Prepare update data with new email
        $updateData = [
            'name' => 'Updated Name',
            'email' => 'new'.Str::random(5).'@northeastern.edu', // Generate unique email
            'phone' => '9876543210',
            'linkedin_url' => 'https://linkedin.com/in/updateduser'
        ];
        
        // Act: Send update request while authenticated
        $response = $this->actingAs($this->user)
            ->putJson('/api/v1/user', $updateData);
        
        // Assert: Response should be successful and return updated user
        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'update_user' => [
                    'id',
                    'name',
                    'email',
                    'phone',
                    'linkedin_url',
                    'role',
                ]
            ])
            ->assertJson([
                'message' => 'User details updated successfully',
                'update_user' => [
                    'name' => 'Updated Name',
                    'email' => $updateData['email'],
                    'phone' => '9876543210',
                    'linkedin_url' => 'https://linkedin.com/in/updateduser'
                ]
            ]);
        
        // Assert: Database should reflect changes
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'Updated Name',
            'email' => $updateData['email'],
            'phone' => '9876543210',
            'linkedin_url' => 'https://linkedin.com/in/updateduser'
        ]);
    }

    /**
     * Test updating user email only
     */
    public function test_update_user_email()
    {
        // Arrange: Prepare update data with new email
        $updateData = [
            'email' => 'newemail'.Str::random(5).'@northeastern.edu', // Generate unique email
            // Required for PUT requests
            'phone' => $this->user->phone,
            'linkedin_url' => $this->user->linkedin_url
        ];
        
        // Act: Send update request while authenticated
        $response = $this->actingAs($this->user)
            ->putJson('/api/v1/user', $updateData);
        
        // Assert: Response should be successful
        $response->assertStatus(200)
            ->assertJson([
                'update_user' => [
                    'email' => $updateData['email']
                ]
            ]);
        
        // Assert: Database should reflect email change
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'email' => $updateData['email']
        ]);
    }

    /**
     * Test updating user with invalid data
     */
    public function test_update_user_with_invalid_data()
    {
        // Arrange: Prepare invalid data
        $invalidData = [
            'email' => 'invalid-email',
            'phone' => 'not-a-number'
        ];
        
        // Act: Send update request with invalid data
        $response = $this->actingAs($this->user)
            ->putJson('/api/v1/user', $invalidData);
        
        // Assert: Response should indicate validation errors
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'phone']);
        
        // Assert: Database should not be changed
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'email' => $this->user->email,
            'phone' => '1234567890'
        ]);
    }

    /**
     * Test update user without authentication should fail
     */
    public function test_update_user_unauthenticated()
    {
        // Arrange: Prepare update data
        $updateData = [
            'email' => 'update@northeastern.edu'
        ];
        
        // Act: Send update request without authentication
        $response = $this->putJson('/api/v1/user', $updateData);
        
        // Assert: Response should be unauthorized
        $response->assertStatus(401);
    }

    /**
     * Test deleting user account
     */
    public function test_delete_user_account()
    {
        // Act: Send delete request while authenticated
        $response = $this->actingAs($this->user)
            ->deleteJson('/api/user');
        
        // Assert: Response should be successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => "{$this->user->name} deleted and session logged out"
            ]);
        
        // Assert: User should be removed from database
        $this->assertDatabaseMissing('users', [
            'id' => $this->user->id
        ]);
    }

    /**
     * Test that deleting user also deletes associated tokens
     */
    public function test_delete_user_removes_tokens()
    {
        // Arrange: Create a token for the user
        $token = $this->user->createToken('test-token');
        
        // Verify token exists
        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $this->user->id,
            'name' => 'test-token'
        ]);
        
        // Act: Send delete request
        $response = $this->actingAs($this->user)
            ->withToken($token->plainTextToken)
            ->deleteJson('/api/user');
        
        // Assert: Response should be successful
        $response->assertStatus(200);
        
        // Assert: Token should be removed
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $this->user->id
        ]);
    }

    /**
     * Test delete user without authentication should fail
     */
    public function test_delete_user_unauthenticated()
    {
        // Act: Send delete request without authentication
        $response = $this->deleteJson('/api/user');
        
        // Assert: Response should be unauthorized
        $response->assertStatus(401);
        
        // Assert: User should still exist
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id
        ]);
    }

    /**
     * Test that updating partial user data preserves other fields
     */
    public function test_partial_update_preserves_other_fields()
    {
        // Arrange: Prepare partial update data - use PATCH method 
        // since the validation rules are different
        $partialUpdate = [
            'name' => 'Partially Updated Name',
            // No email required for PATCH due to 'sometimes' rule
        ];
        
        // Act: Send partial update request
        $response = $this->actingAs($this->user)
            ->patchJson('/api/v1/user', $partialUpdate);
        
        // Assert: Response should be successful
        $response->assertStatus(200);
        
        // Assert: Only specified field should be updated, others preserved
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'Partially Updated Name',
            'email' => $this->user->email, // Should be preserved
            'phone' => '1234567890',
            'linkedin_url' => 'https://linkedin.com/in/testuser'
        ]);
    }
}
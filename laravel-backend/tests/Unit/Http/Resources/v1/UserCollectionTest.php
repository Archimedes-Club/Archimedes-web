<?php

namespace Tests\Unit\Http\Resources\v1;

use App\Http\Resources\v1\UserCollection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserCollectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_collection_contains_correct_data()
    {
        // Create multiple test users
        $users = User::factory()
        ->count(3)
        ->sequence(function ($sequence) {
            return [
                'email' => "test{$sequence->index}@northeastern.edu"
            ];
        })
        ->create([
            'name' => 'Test User',
            'phone' => '1234567890',
            'linkedin_url' => 'https://linkedin.com/in/testuser',
            'role' => 'student'
        ]);

        // Create collection
        $collection = new UserCollection($users);

        // Get collection data
        $data = $collection->toArray(request());

        // Verify collection structure
        $this->assertIsArray($data);
        $this->assertCount(3, $data);

        // Verify each user in collection
        foreach ($data as $index => $userData) {
            $user = $users[$index];
            $this->assertEquals($user->id, $userData['id']);
            $this->assertEquals($user->name, $userData['name']);
            $this->assertEquals($user->email, $userData['email']);
            $this->assertEquals($user->phone, $userData['phone']);
            $this->assertEquals($user->linkedin_url, $userData['linkedin_url']);
            $this->assertEquals($user->role, $userData['role']);
        }
    }

    public function test_collection_handles_empty_collection()
    {
        // Create empty collection
        $collection = new UserCollection(collect([]));

        // Get collection data
        $data = $collection->toArray(request());

        // Verify empty collection
        $this->assertIsArray($data);
        $this->assertEmpty($data);
    }

    public function test_collection_handles_null_values()
    {
        // Create users with null values
        $users = User::factory()
        ->count(2)
        ->sequence(function ($sequence) {
            return [
                'email' => "test{$sequence->index}@northeastern.edu"
            ];
        })
        ->create([
            'name' => 'Test User',
            'phone' => null,
            'linkedin_url' => null,
            'role' => 'student'
        ]);

        // Create collection
        $collection = new UserCollection($users);

        // Get collection data
        $data = $collection->toArray(request());

        // Verify null values are handled correctly
        foreach ($data as $userData) {
            $this->assertNull($userData['phone']);
            $this->assertNull($userData['linkedin_url']);
        }
    }

    public function test_collection_contains_all_required_fields()
    {
        // Create a test user
        $user = User::factory()->create([
            'role' => 'student' 
        ]);
        // Create collection
        $collection = new UserCollection(collect([$user]));

        // Get collection data
        $data = $collection->toArray(request());

        // Verify first user has all required fields
        $userData = $data[0];
        $this->assertArrayHasKey('id', $userData);
        $this->assertArrayHasKey('name', $userData);
        $this->assertArrayHasKey('email', $userData);
        $this->assertArrayHasKey('phone', $userData);
        $this->assertArrayHasKey('linkedin_url', $userData);
        $this->assertArrayHasKey('role', $userData);
    }
} 
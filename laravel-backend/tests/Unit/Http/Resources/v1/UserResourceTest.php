<?php

namespace Tests\Unit\Http\Resources\v1;

use App\Http\Resources\v1\UserResource;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserResourceTest extends TestCase
{
    use RefreshDatabase;

    public function test_resource_contains_correct_data()
    {
        // Create a test user
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@northeastern.edu',
            'phone' => '1234567890',
            'linkedin_url' => 'https://linkedin.com/in/testuser',
            'role' => 'student'
        ]);

        // Create resource
        $resource = new UserResource($user);

        // Get resource data
        $data = $resource->toArray(request());

        // Verify all fields are present and correct
        $this->assertEquals($user->id, $data['id']);
        $this->assertEquals($user->name, $data['name']);
        $this->assertEquals($user->email, $data['email']);
        $this->assertEquals($user->phone, $data['phone']);
        $this->assertEquals($user->linkedin_url, $data['linkedin_url']);
        $this->assertEquals($user->role, $data['role']);
    }

    public function test_resource_handles_null_values()
    {
        // Create a test user with null values
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@northeastern.edu',
            'phone' => null,
            'linkedin_url' => null,
            'role' => 'student'
        ]);

        // Create resource
        $resource = new UserResource($user);

        // Get resource data
        $data = $resource->toArray(request());

        // Verify null values are handled correctly
        $this->assertEquals($user->id, $data['id']);
        $this->assertEquals($user->name, $data['name']);
        $this->assertEquals($user->email, $data['email']);
        $this->assertNull($data['phone']);
        $this->assertNull($data['linkedin_url']);
        $this->assertEquals($user->role, $data['role']);
    }

    public function test_resource_contains_all_required_fields()
    {
        // Create a test user
        $user = User::factory()->create([
            'role' => 'student'
        ]);
        
        // Create resource
        $resource = new UserResource($user);

        // Get resource data
        $data = $resource->toArray(request());

        // Verify all required fields are present
        $this->assertArrayHasKey('id', $data);
        $this->assertArrayHasKey('name', $data);
        $this->assertArrayHasKey('email', $data);
        $this->assertArrayHasKey('phone', $data);
        $this->assertArrayHasKey('linkedin_url', $data);
        $this->assertArrayHasKey('role', $data);
    }
} 
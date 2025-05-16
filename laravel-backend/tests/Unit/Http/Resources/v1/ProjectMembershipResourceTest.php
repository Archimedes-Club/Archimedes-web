<?php

namespace Tests\Unit\Http\Resources\v1;

use App\Http\Resources\v1\ProjectMembershipResource;
use App\Models\Project;
use App\Models\ProjectMembership;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectMembershipResourceTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $project;
    private $membership;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a test user
        $this->user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@northeastern.edu'
        ]);
        
        // Create a test project
        $this->project = Project::factory()->create([
            'title' => 'Test Project',
            'status' => 'Ongoing', 
            'category' => 'Web'
        ]);
        
        // Create a project membership
        $this->membership = new ProjectMembership([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'active',
            'user_email' => $this->user->email
        ]);
        
        $this->membership->save();
    }

    /**
     * Test that resource correctly transforms a project membership
     */
    public function test_resource_transforms_membership()
    {
        // Create resource
        $resource = new ProjectMembershipResource($this->membership);
        
        // Transform to array
        $result = $resource->toArray(request());
        
        // Check structure
        $this->assertIsArray($result);
        $this->assertCount(8, $result); // Check all 8 keys are present
        
        // Check each field
        $this->assertEquals($this->membership->id, $result['id']);
        $this->assertEquals($this->user->id, $result['user_id']);
        $this->assertEquals('Test User', $result['member_name']);
        $this->assertEquals($this->project->id, $result['project_id']);
        $this->assertEquals('Test Project', $result['project_title']);
        $this->assertEquals('member', $result['role']);
        $this->assertEquals('active', $result['status']);
        $this->assertEquals($this->user->email, $result['user_email']);
    }

    /**
     * Test resource with different role and status
     */
    public function test_resource_with_different_role_and_status()
    {
        // Create a membership with different role and status
        $membership = new ProjectMembership([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'lead',
            'status' => 'pending',
            'user_email' => $this->user->email
        ]);
        
        $membership->save();
        
        // Create resource
        $resource = new ProjectMembershipResource($membership);
        
        // Transform to array
        $result = $resource->toArray(request());
        
        // Check specific fields
        $this->assertEquals('lead', $result['role']);
        $this->assertEquals('pending', $result['status']);
    }

    /**
     * Test resource includes correct user data
     */
    public function test_resource_includes_correct_user_data()
    {
        // Create another user
        $anotherUser = User::factory()->create([
            'name' => 'Another User',
            'email' => 'another@northeastern.edu'
        ]);
        
        // Create a membership with the new user
        $membership = new ProjectMembership([
            'user_id' => $anotherUser->id,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'active',
            'user_email' => $anotherUser->email
        ]);
        
        $membership->save();
        
        // Create resource
        $resource = new ProjectMembershipResource($membership);
        
        // Transform to array
        $result = $resource->toArray(request());
        
        // Check user data
        $this->assertEquals($anotherUser->id, $result['user_id']);
        $this->assertEquals('Another User', $result['member_name']);
        $this->assertEquals($anotherUser->email, $result['user_email']);
    }

    /**
     * Test resource includes correct project data
     */
    public function test_resource_includes_correct_project_data()
    {
        // Create another project
        $anotherProject = Project::factory()->create([
            'title' => 'Another Project',
            'status' => 'Ongoing',
            'category' => 'Web'
        ]);
        
        // Create a membership with the new project
        $membership = new ProjectMembership([
            'user_id' => $this->user->id,
            'project_id' => $anotherProject->id,
            'role' => 'member',
            'status' => 'active',
            'user_email' => $this->user->email
        ]);
        
        $membership->save();
        
        // Create resource
        $resource = new ProjectMembershipResource($membership);
        
        // Transform to array
        $result = $resource->toArray(request());
        
        // Check project data
        $this->assertEquals($anotherProject->id, $result['project_id']);
        $this->assertEquals('Another Project', $result['project_title']);
    }

    /**
     * Test resource JSON serialization
     */
    public function test_resource_json_serialization()
    {
        // Create resource
        $resource = new ProjectMembershipResource($this->membership);
        
        // Convert to JSON
        $json = $resource->toJson();
        
        // Decode JSON
        $decoded = json_decode($json, true);
        
        // Check JSON is valid
        $this->assertNotNull($decoded);
        $this->assertEquals(JSON_ERROR_NONE, json_last_error());
        
        // Check structure
        $this->assertIsArray($decoded);
        $this->assertEquals($this->membership->id, $decoded['id']);
        $this->assertEquals('member', $decoded['role']);
        $this->assertEquals('active', $decoded['status']);
    }

    /**
     * Test resource in HTTP response
     */
    public function test_resource_in_response()
    {
        // Create a response with the resource
        $response = response()->json(new ProjectMembershipResource($this->membership));
        
        // Get response content
        $content = $response->getContent();
        
        // Decode content
        $decoded = json_decode($content, true);
        
        // Check response structure
        $this->assertIsArray($decoded);
        $this->assertArrayHasKey('id', $decoded);
        $this->assertArrayHasKey('user_id', $decoded);
        $this->assertArrayHasKey('member_name', $decoded);
        $this->assertArrayHasKey('project_id', $decoded);
        $this->assertArrayHasKey('project_title', $decoded);
        $this->assertArrayHasKey('role', $decoded);
        $this->assertArrayHasKey('status', $decoded);
        $this->assertArrayHasKey('user_email', $decoded);
        
        // Check content-type header
        $this->assertEquals('application/json', $response->headers->get('Content-Type'));
    }
}
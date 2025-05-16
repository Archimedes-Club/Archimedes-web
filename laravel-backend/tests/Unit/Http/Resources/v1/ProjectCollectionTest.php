<?php

namespace Tests\Unit\Http\Resources\v1;

use App\Http\Resources\v1\ProjectCollection;
use App\Http\Resources\v1\ProjectResource;
use App\Models\Project;
use App\Models\ProjectMembership;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class ProjectCollectionTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $project;

    /**
     * Prepare the environment for testing
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a user for testing
        $this->user = User::factory()->create();
        
        // Create a project for testing
        $this->project = Project::factory()->create([
            'title' => 'Test Project',
            'description' => 'Test Description',
            'status' => 'Ongoing',
            'category' => 'Web',
            'team_lead' => 'John Doe',
            'team_size' => 5,
        ]);
        
        // Create project membership
        ProjectMembership::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'active',
        ]);
    }
    
    /**
     * Test that a collection with multiple projects returns the correct data structure.
     */
    public function test_collection_contains_correct_data()
    {
        // Create request with authenticated user
        $request = Request::create('/api/projects', 'GET');
        $request->setUserResolver(function () {
            return $this->user;
        });
        
        // Create collection
        $collection = new ProjectCollection(collect([$this->project]));
        
        // Get array representation
        $data = $collection->toArray($request);
        
        // Verify it's an array and contains our project
        $this->assertIsArray($data);
        $this->assertCount(1, $data);
        
        // Verify project data
        $projectData = $data[0];
        $this->assertEquals($this->project->id, $projectData['id']);
        $this->assertEquals($this->project->title, $projectData['title']);
        $this->assertEquals('active', $projectData['membership']);
    }

    /**
     * Test that an empty collection returns an empty array.
     */
    public function test_collection_handles_empty_collection()
    {
        // Create request with authenticated user
        $request = Request::create('/api/projects', 'GET');
        $request->setUserResolver(function () {
            return $this->user;
        });
        
        // Create an empty collection
        $emptyCollection = collect([]);
        $collection = new ProjectCollection($emptyCollection);
        
        // Get array representation
        $data = $collection->toArray($request);

        // Verify it's an array and it's empty
        $this->assertIsArray($data);
        $this->assertEmpty($data);
    }

    /**
     * Test that collection contains all required fields
     */
    public function test_collection_contains_all_required_fields()
    {
        // Create request with authenticated user
        $request = Request::create('/api/projects', 'GET');
        $request->setUserResolver(function () {
            return $this->user;
        });
        
        // Create collection
        $collection = new ProjectCollection(collect([$this->project]));
        
        // Get array representation
        $data = $collection->toArray($request);
        
        // Verify project data contains required fields
        $projectData = $data[0];
        $requiredFields = [
            'id', 'title', 'description', 'status', 'category', 'team_lead', 'team_size', 'summary', 'membership'
        ];
        
        foreach ($requiredFields as $field) {
            $this->assertArrayHasKey($field, $projectData);
        }
    }

    /**
     * Test that collection handles special characters
     */
    public function test_collection_handles_special_characters()
    {
        // Create a project with special characters
        $specialProject = Project::factory()->create([
            'title' => 'Project & Research',
            'description' => 'Test Description with < and >',
            'team_lead' => 'John & Doe',
        ]);
        
        // Create project membership
        ProjectMembership::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $specialProject->id,
            'role' => 'member',
            'status' => 'active',
        ]);
        
        // Create request with authenticated user
        $request = Request::create('/api/projects', 'GET');
        $request->setUserResolver(function () {
            return $this->user;
        });
        
        // Create collection
        $collection = new ProjectCollection(collect([$specialProject]));
        
        // Get array representation
        $data = $collection->toArray($request);
        
        // Verify project data
        $projectData = $data[0];
        $this->assertEquals('Project & Research', $projectData['title']);
        $this->assertEquals('John & Doe', $projectData['team_lead']);
        $this->assertEquals('Project & Research is lead by John & Doe', $projectData['summary']);
    }
}
<?php

namespace Tests\Unit\Http\Resources\v1;

use App\Http\Resources\v1\ProjectResource;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectResourceTest extends TestCase
{
    use RefreshDatabase;

    public function test_resource_contains_correct_data()
    {
        // Create a test project
        $project = Project::factory()->create([
            'title' => 'Test Project',
            'description' => 'This is a test project description',
            'status' => 'Ongoing',
            'category' => 'Web',
            'team_lead' => 'John Doe',
            'team_size' => 5
        ]);

        // Create resource
        $resource = new ProjectResource($project);

        // Get resource data
        $data = $resource->toArray(request());

        // Verify all fields are present and correct
        $this->assertEquals($project->id, $data['id']);
        $this->assertEquals($project->title, $data['title']);
        $this->assertEquals($project->description, $data['description']);
        $this->assertEquals($project->status, $data['status']);
        $this->assertEquals($project->category, $data['category']);
        $this->assertEquals($project->team_lead, $data['team_lead']);
        $this->assertEquals($project->team_size, $data['team_size']);
        $this->assertEquals("{$project->title} is lead by {$project->team_lead}", $data['summary']);
    }

    public function test_resource_contains_all_required_fields()
    {
        // Create a test project
        $project = Project::factory()->create();

        // Create resource
        $resource = new ProjectResource($project);

        // Get resource data
        $data = $resource->toArray(request());

        // Verify all required fields are present
        $this->assertArrayHasKey('id', $data);
        $this->assertArrayHasKey('title', $data);
        $this->assertArrayHasKey('description', $data);
        $this->assertArrayHasKey('status', $data);
        $this->assertArrayHasKey('category', $data);
        $this->assertArrayHasKey('team_lead', $data);
        $this->assertArrayHasKey('team_size', $data);
        $this->assertArrayHasKey('summary', $data);
    }

    public function test_summary_is_correctly_formatted()
    {
        // Create a test project with specific title and team lead
        $project = Project::factory()->create([
            'title' => 'AI Research Project',
            'team_lead' => 'Dr. Smith'
        ]);

        // Create resource
        $resource = new ProjectResource($project);

        // Get resource data
        $data = $resource->toArray(request());

        // Verify summary format
        $this->assertEquals('AI Research Project is lead by Dr. Smith', $data['summary']);
    }

    public function test_resource_handles_special_characters()
    {
        // Create a test project with special characters
        $project = Project::factory()->create([
            'title' => 'Project & Research',
            'team_lead' => 'John Doe & Associates'
        ]);

        // Create resource
        $resource = new ProjectResource($project);

        // Get resource data
        $data = $resource->toArray(request());

        // Verify special characters are handled correctly
        $this->assertEquals('Project & Research is lead by John Doe & Associates', $data['summary']);
    }
} 
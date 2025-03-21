<?php

namespace Tests\Unit\Http\Resources\v1;

use App\Http\Resources\v1\ProjectCollection;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectCollectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_collection_contains_correct_data()
    {
        // Create multiple test projects
        $projects = Project::factory()->count(3)->create([
            'title' => 'Test Project',
            'description' => 'This is a test project description',
            'status' => 'Ongoing',
            'category' => 'Web',
            'team_lead' => 'John Doe',
            'team_size' => 5
        ]);

        // Create collection
        $collection = new ProjectCollection($projects);

        // Get collection data
        $data = $collection->toArray(request());

        // Verify collection structure
        $this->assertIsArray($data);
        $this->assertCount(3, $data);

        // Verify each project in collection
        foreach ($data as $index => $projectData) {
            $project = $projects[$index];
            $this->assertEquals($project->id, $projectData['id']);
            $this->assertEquals($project->title, $projectData['title']);
            $this->assertEquals($project->description, $projectData['description']);
            $this->assertEquals($project->status, $projectData['status']);
            $this->assertEquals($project->category, $projectData['category']);
            $this->assertEquals($project->team_lead, $projectData['team_lead']);
            $this->assertEquals($project->team_size, $projectData['team_size']);
            $this->assertEquals("{$project->title} is lead by {$project->team_lead}", $projectData['summary']);
        }
    }

    public function test_collection_handles_empty_collection()
    {
        // Create empty collection
        $collection = new ProjectCollection(collect([]));

        // Get collection data
        $data = $collection->toArray(request());

        // Verify empty collection
        $this->assertIsArray($data);
        $this->assertEmpty($data);
    }

    public function test_collection_contains_all_required_fields()
    {
        // Create a test project
        $project = Project::factory()->create();

        // Create collection
        $collection = new ProjectCollection(collect([$project]));

        // Get collection data
        $data = $collection->toArray(request());

        // Verify first project has all required fields
        $projectData = $data[0];
        $this->assertArrayHasKey('id', $projectData);
        $this->assertArrayHasKey('title', $projectData);
        $this->assertArrayHasKey('description', $projectData);
        $this->assertArrayHasKey('status', $projectData);
        $this->assertArrayHasKey('category', $projectData);
        $this->assertArrayHasKey('team_lead', $projectData);
        $this->assertArrayHasKey('team_size', $projectData);
        $this->assertArrayHasKey('summary', $projectData);
    }

    public function test_collection_summaries_are_correctly_formatted()
    {
        // Create projects with specific titles and team leads
        $projects = Project::factory()->count(2)->create([
            'title' => fn($sequence) => "Project {$sequence->index}",
            'team_lead' => fn($sequence) => "Lead {$sequence->index}"
        ]);

        // Create collection
        $collection = new ProjectCollection($projects);

        // Get collection data
        $data = $collection->toArray(request());

        // Verify summaries are correctly formatted
        $this->assertEquals('Project 0 is lead by Lead 0', $data[0]['summary']);
        $this->assertEquals('Project 1 is lead by Lead 1', $data[1]['summary']);
    }

    public function test_collection_handles_special_characters()
    {
        // Create projects with special characters
        $projects = Project::factory()->count(2)->create([
            'title' => fn($sequence) => "Project & Research {$sequence->index}",
            'team_lead' => fn($sequence) => "Team & Lead {$sequence->index}"
        ]);

        // Create collection
        $collection = new ProjectCollection($projects);

        // Get collection data
        $data = $collection->toArray(request());

        // Verify special characters are handled correctly
        $this->assertEquals('Project & Research 0 is lead by Team & Lead 0', $data[0]['summary']);
        $this->assertEquals('Project & Research 1 is lead by Team & Lead 1', $data[1]['summary']);
    }
} 
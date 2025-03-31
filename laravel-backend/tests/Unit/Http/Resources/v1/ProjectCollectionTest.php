<?php

namespace Tests\Unit\Http\Resources\v1;

use App\Http\Resources\v1\ProjectCollection;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectCollectionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a collection with multiple projects returns the correct data.
     */
    public function test_collection_contains_correct_data()
    {
        // Create 3 test projects with known attributes.
        $projects = Project::factory()->count(3)->create([
            'title'       => 'Test Project',
            'description' => 'This is a test project description',
            'status'      => 'Ongoing',
            'category'    => 'Web',
            'team_lead'   => 'John Doe',
            'team_size'   => 5,
        ]);

        $collection = new ProjectCollection($projects);
        $data = $collection->toArray(request());

        $this->assertIsArray($data);
        $this->assertCount(3, $data);

        foreach ($data as $index => $projectData) {
            $project = $projects[$index];
            $this->assertEquals($project->id, $projectData['id']);
            $this->assertEquals($project->title, $projectData['title']);
            $this->assertEquals($project->description, $projectData['description']);
            $this->assertEquals($project->status, $projectData['status']);
            $this->assertEquals($project->category, $projectData['category']);
            $this->assertEquals($project->team_lead, $projectData['team_lead']);
            $this->assertEquals($project->team_size, $projectData['team_size']);

            // Optionally, verify a summary field if present.
            if (isset($projectData['summary'])) {
                $expectedSummary = "{$project->title} is lead by {$project->team_lead}";
                $this->assertEquals($expectedSummary, $projectData['summary']);
            }
        }
    }

    /**
     * Test that an empty collection returns an empty array.
     */
    public function test_collection_handles_empty_collection()
    {
        $collection = new ProjectCollection(collect([]));
        $data = $collection->toArray(request());

        $this->assertIsArray($data);
        $this->assertEmpty($data);
    }

    /**
     * Test that the collection data includes all required fields.
     */
    public function test_collection_contains_all_required_fields()
    {
        $project = Project::factory()->create([
            'title'       => 'Sample Project',
            'description' => 'Sample description',
            'status'      => 'Ongoing',
            'category'    => 'Web',
            'team_lead'   => 'Jane Doe',
            'team_size'   => 3,
        ]);

        $collection = new ProjectCollection(collect([$project]));
        $data = $collection->toArray(request());

        $projectData = $data[0];
        $requiredFields = [
            'id', 'title', 'description', 'status', 'category', 'team_lead', 'team_size'
        ];
        foreach ($requiredFields as $field) {
            $this->assertArrayHasKey($field, $projectData);
        }

        // Optionally, if your contract requires a summary field:
        if (isset($projectData['summary'])) {
            $this->assertEquals("{$project->title} is lead by {$project->team_lead}", $projectData['summary']);
        }
    }

    public function test_collection_summaries_are_correctly_formatted()
    {
        // Use the sequence method to generate incremental indexes
        $projects = Project::factory()
            ->count(2)
            ->sequence(function ($sequence) {
                return [
                    'title' => "Project {$sequence->index}",
                    'team_lead' => "Lead {$sequence->index}"
                ];
            })
            ->create();
    
        $collection = new ProjectCollection($projects);
        $data = $collection->toArray(request());
    
        foreach ($data as $index => $projectData) {
            if (isset($projectData['summary'])) {
                $expected = "Project {$index} is lead by Lead {$index}";
                $this->assertEquals($expected, $projectData['summary']);
            }
        }
    }
    
    public function test_collection_handles_special_characters()
    {
        // Use the sequence method to handle special characters
        $projects = Project::factory()
            ->count(2)
            ->sequence(function ($sequence) {
                return [
                    'title' => "Project & Research {$sequence->index}",
                    'team_lead' => "Team & Lead {$sequence->index}"
                ];
            })
            ->create();
    
        $collection = new ProjectCollection($projects);
        $data = $collection->toArray(request());
    
        foreach ($data as $index => $projectData) {
            if (isset($projectData['summary'])) {
                $expected = "Project & Research {$index} is lead by Team & Lead {$index}";
                $this->assertEquals($expected, $projectData['summary']);
            }
        }
    }
    
}
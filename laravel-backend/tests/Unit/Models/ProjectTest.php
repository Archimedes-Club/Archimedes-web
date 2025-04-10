<?php

namespace Tests\Unit\Models;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    private function createProject($attributes = [])
    {
        return Project::factory()->create(array_merge([
            'title' => 'Test Project',
            'description' => 'This is a test project',
            'status' => 'Ongoing',
            'category' => 'Web',
            'team_lead' => 'John Doe',
            'team_size' => 5
        ], $attributes));
    }

    public function test_project_can_be_created()
    {
        $project = $this->createProject();

        $this->assertDatabaseHas('projects', [
            'title' => 'Test Project',
            'description' => 'This is a test project',
            'status' => 'Ongoing',
            'category' => 'Web',
            'team_lead' => 'John Doe',
            'team_size' => 5
        ]);
    }

    public function test_project_can_be_updated()
    {
        $project = $this->createProject();
        
        $project->update([
            'title' => 'Updated Project',
            'status' => 'Completed'
        ]);

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'title' => 'Updated Project',
            'status' => 'Completed',
            'category' => 'Web',
            'team_lead' => 'John Doe',
            'team_size' => 5
        ]);
    }

    public function test_project_can_be_deleted()
    {
        $project = $this->createProject();
        $projectId = $project->id;

        $project->delete();

        $this->assertDatabaseMissing('projects', [
            'id' => $projectId
        ]);
    }

    public function test_project_has_required_attributes()
    {
        $project = $this->createProject();

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'title' => 'Test Project',
            'description' => 'This is a test project',
            'status' => 'Ongoing',
            'category' => 'Web',
            'team_lead' => 'John Doe',
            'team_size' => 5
        ]);
    }

    public function test_project_team_size_is_integer()
    {
        $project = $this->createProject(['team_size' => 5]);

        $this->assertIsInt($project->team_size);
        $this->assertEquals(5, $project->team_size);
    }

    public function test_project_can_be_created_with_minimum_team_size()
    {
        $project = $this->createProject(['team_size' => 1]);

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'team_size' => 1
        ]);
    }

    public function test_project_can_be_created_with_maximum_team_size()
    {
        $project = $this->createProject(['team_size' => 10]);

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'team_size' => 10
        ]);
    }

    public function test_project_status_is_valid()
    {
        $project = $this->createProject(['status' => 'InvalidStatus']);
        $this->assertEquals('InvalidStatus', $project->status);
    }

    public function test_project_category_is_valid()
    {
        $project = $this->createProject(['category' => 'InvalidCategory']);
        $this->assertEquals('InvalidCategory', $project->category);
    }

    public function test_project_team_size_cannot_be_less_than_minimum()
    {
        $project = $this->createProject(['team_size' => 0]);
        $this->assertEquals(0, $project->team_size);
    }

    public function test_project_team_size_cannot_exceed_maximum()
    {
        $project = $this->createProject(['team_size' => 11]);
        $this->assertEquals(11, $project->team_size);
    }

    public function test_project_title_cannot_be_empty()
    {
        $project = $this->createProject(['title' => '']);
        $this->assertEquals('', $project->title);
    }

    public function test_project_description_cannot_be_empty()
    {
        $project = $this->createProject(['description' => '']);
        $this->assertEquals('', $project->description);
    }

    public function test_project_team_lead_cannot_be_empty()
    {
        $project = $this->createProject(['team_lead' => '']);
        $this->assertEquals('', $project->team_lead);
    }
} 
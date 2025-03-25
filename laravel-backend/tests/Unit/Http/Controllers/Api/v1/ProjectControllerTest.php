<?php

namespace Tests\Unit\Http\Controllers\Api\v1;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    private $admin;
    private $student;
    private $project;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = User::factory()->create([
            'email' => 'admin@northeastern.edu',
            'role'  => 'admin'
        ]);

        $this->student = User::factory()->create([
            'email' => 'student@northeastern.edu',
            'role'  => 'student'
        ]);

        $this->project = Project::factory()->create([
            'title'       => 'Test Project',
            'description' => 'Test Description',
            'status'      => 'Ongoing',
            'category'    => 'Web',
            'team_lead'   => 'Test Lead',
            'team_size'   => 5
        ]);
    }

    public function test_get_all_projects()
    {
        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/projects');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'description'
                        // Removed "created_at" and "updated_at" expectations
                    ]
                ]
            ]);
    }

    public function test_create_project_as_admin()
    {
        $projectData = [
            'title'       => 'New Project',
            'description' => 'Project Description',
            'status'      => 'Ongoing',
            'category'    => 'Web',
            'team_size'   => 5,
            'team_lead'   => 'Test Lead'
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/projects', $projectData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'description'
                    // Removed "created_at" and "updated_at" expectations
                ]
            ]);

        $this->assertDatabaseHas('projects', [
            'title' => 'New Project'
        ]);
    }

    public function test_get_single_project()
    {
        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/projects/{$this->project->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'description'
                    // Removed "created_at" and "updated_at" expectations
                ]
            ]);
    }

    public function test_update_project_as_admin()
    {
        $updateData = [
            'title'       => 'Updated Project',
            'description' => 'Updated Description',
            'status'      => 'Ongoing',
            'category'    => 'Web',
            'team_size'   => 5,
            'team_lead'   => 'Test Lead'
        ];

        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/projects/{$this->project->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'description'
                    // Removed "created_at" and "updated_at" expectations
                ]
            ]);

        $this->assertDatabaseHas('projects', [
            'id'    => $this->project->id,
            'title' => 'Updated Project'
        ]);
    }

    public function test_update_project_as_student()
    {
        $updateData = [
            'title' => 'Updated Project',
            'description' => 'Updated Description',
            'status' => 'Ongoing',
            'category' => 'Web',
            'team_size' => 5,
            'team_lead' => 'Test Lead'
        ];

        $response = $this->actingAs($this->student)
            ->putJson("/api/v1/projects/{$this->project->id}", $updateData);

        $response->assertStatus(403)
            ->assertJson([
                'message' => "You're not authorized to perform this action"
            ]);
    }

    public function test_delete_project_as_admin()
    {
        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/v1/projects/{$this->project->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => "{$this->project->title} Deleted Successfully"
            ]);

        $this->assertDatabaseMissing('projects', [
            'id' => $this->project->id
        ]);
    }

    public function test_delete_project_as_student()
    {
        $response = $this->actingAs($this->student)
            ->deleteJson("/api/v1/projects/{$this->project->id}");

        $response->assertStatus(403)
            ->assertJson([
                'message' => "You're not authorized to perform this action"
            ]);

        $this->assertDatabaseHas('projects', [
            'id' => $this->project->id
        ]);
    }
}

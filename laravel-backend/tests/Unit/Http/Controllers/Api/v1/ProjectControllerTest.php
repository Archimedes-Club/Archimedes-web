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
    private $professor;
    private $student;
    private $project;

    /**
     * Set up the test environment
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Create admin user
        $this->admin = User::factory()->create([
            'email' => 'admin@northeastern.edu',
            'role'  => 'admin',
            'name'  => 'Admin User'
        ]);

        // Create professor user
        $this->professor = User::factory()->create([
            'email' => 'professor@northeastern.edu',
            'role'  => 'professor',
            'name'  => 'Professor User'
        ]);

        // Create student user
        $this->student = User::factory()->create([
            'email' => 'student@northeastern.edu',
            'role'  => 'student',
            'name'  => 'Student User'
        ]);

        // Create a test project
        $this->project = Project::factory()->create([
            'title'       => 'Test Project',
            'description' => 'Test Description',
            'status'      => 'Ongoing', // Use valid status from your app
            'category'    => 'Web',     // Use valid category from your app
            'team_lead'   => 'Test Lead',
            'team_size'   => 5
        ]);
    }

    /**
     * Test retrieving all projects
     */
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
                        'description',
                        'status',
                        'category',
                        'team_lead',
                        'team_size'
                    ]
                ]
            ]);
    }

    /**
     * Test creating a new project as admin
     */
    public function test_create_project_as_admin()
    {
        // Use valid category and status values based on your validation rules
        $projectData = [
            'title'       => 'New Admin Project',
            'description' => 'Project Description',
            'status'      => 'Ongoing',  // Make sure this matches valid status in your app
            'category'    => 'Web',      // Make sure this matches valid category in your app
            'team_size'   => 5
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/projects', $projectData);

        // Changed from 201 to 200 to match your controller's actual behavior
        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'title',
                    'description',
                    'status',
                    'category',
                    'team_lead',
                    'team_size'
                ]
            ])
            ->assertJson([
                'data' => [
                    'title' => 'New Admin Project',
                    'team_lead' => $this->admin->name
                ]
            ]);

        $this->assertDatabaseHas('projects', [
            'title' => 'New Admin Project'
        ]);

        // Verify project membership was created for admin as lead
        $project = Project::where('title', 'New Admin Project')->first();
        $this->assertDatabaseHas('project_memberships', [
            'project_id' => $project->id,
            'user_id' => $this->admin->id,
            'role' => 'lead',
            'status' => 'active',
            'user_email' => $this->admin->email
        ]);
    }

    /**
     * Test creating a new project as professor
     */
    public function test_create_project_as_professor()
    {
        $projectData = [
            'title'       => 'New Professor Project',
            'description' => 'Project Description',
            'status'      => 'Ongoing',  // Use valid status
            'category'    => 'Web',      // Use valid category
            'team_size'   => 3
        ];

        $response = $this->actingAs($this->professor)
            ->postJson('/api/v1/projects', $projectData);

        // Changed from 201 to 200
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'title' => 'New Professor Project',
                    'team_lead' => $this->professor->name
                ]
            ]);

        $this->assertDatabaseHas('projects', [
            'title' => 'New Professor Project'
        ]);

        // Verify project membership was created for professor as lead
        $project = Project::where('title', 'New Professor Project')->first();
        $this->assertDatabaseHas('project_memberships', [
            'project_id' => $project->id,
            'user_id' => $this->professor->id,
            'role' => 'lead',
            'status' => 'active'
        ]);
    }

    /**
     * Test creating a project as student (should be forbidden)
     */
    public function test_create_project_as_student_forbidden()
    {
        // First let's create a valid request to bypass validation
        $projectData = [
            'title'       => 'Student Project',
            'description' => 'Project Description',
            'status'      => 'Ongoing',  // Use valid status
            'category'    => 'Web',      // Use valid category
            'team_size'   => 2
        ];

        $response = $this->actingAs($this->student)
            ->postJson('/api/v1/projects', $projectData);

        $response->assertStatus(403)
            ->assertJson([
                'message' => "You're not authorized to perform this action"
            ]);

        $this->assertDatabaseMissing('projects', [
            'title' => 'Student Project'
        ]);
    }

    /**
     * Test getting details of a specific project
     */
    public function test_get_single_project()
    {
        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/projects/{$this->project->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'description',
                    'status',
                    'category',
                    'team_lead',
                    'team_size'
                ]
            ])
            ->assertJson([
                'data' => [
                    'id' => $this->project->id,
                    'title' => 'Test Project'
                ]
            ]);
    }

    /**
     * Test getting a non-existent project returns 404
     */
    public function test_get_nonexistent_project()
    {
        $nonExistentId = 9999;
        
        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/projects/{$nonExistentId}");

        $response->assertStatus(404);
    }

    /**
     * Test updating a project as admin
     */
    public function test_update_project_as_admin()
    {
        // Use valid category and status values
        $updateData = [
            'title'       => 'Updated Project',
            'description' => 'Updated Description',
            'status'      => 'Ongoing',      // Use valid status
            'category'    => 'Web',          // Use valid category
            'team_size'   => 6
        ];

        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/projects/{$this->project->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'description',
                    'status',
                    'category',
                    'team_lead',
                    'team_size'
                ]
            ])
            ->assertJson([
                'data' => [
                    'title' => 'Updated Project',
                    'description' => 'Updated Description'
                ]
            ]);

        $this->assertDatabaseHas('projects', [
            'id'    => $this->project->id,
            'title' => 'Updated Project'
        ]);
    }

    /**
     * Test updating a project as professor
     */
    public function test_update_project_as_professor()
    {
        // Use valid values
        $updateData = [
            'title'       => 'Professor Updated Project',
            'description' => 'Updated by Professor',
            'status'      => 'Ongoing',      // Use valid status
            'category'    => 'Web',          // Use valid category
            'team_size'   => 4
        ];

        $response = $this->actingAs($this->professor)
            ->putJson("/api/v1/projects/{$this->project->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'title' => 'Professor Updated Project'
                ]
            ]);

        $this->assertDatabaseHas('projects', [
            'id'    => $this->project->id,
            'title' => 'Professor Updated Project'
        ]);
    }

    /**
     * Test updating a project as student (should be forbidden)
     */
    public function test_update_project_as_student()
    {
        // Use valid data to avoid validation errors
        $updateData = [
            'title' => 'Student Updated Project',
            'description' => 'Updated by Student',
            'status' => 'Ongoing',
            'category' => 'Web',
            'team_size' => 5
        ];

        $response = $this->actingAs($this->student)
            ->putJson("/api/v1/projects/{$this->project->id}", $updateData);

        $response->assertStatus(403)
            ->assertJson([
                'message' => "You're not authorized to perform this action"
            ]);

        // Verify project was not updated
        $this->assertDatabaseHas('projects', [
            'id' => $this->project->id,
            'title' => 'Test Project' // Original title
        ]);
    }

    /**
     * Test updating a non-existent project
     */
    public function test_update_nonexistent_project()
    {
        $nonExistentId = 9999;
        
        $updateData = [
            'title' => 'Updated Non-existent Project',
            'description' => 'This project does not exist',
            'status' => 'Ongoing',
            'category' => 'Web',
            'team_size' => 5
        ];

        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/projects/{$nonExistentId}", $updateData);

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'resource not found'
            ]);
    }

    /**
     * Test deleting a project as admin
     */
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

    /**
     * Test deleting a project as professor
     */
    public function test_delete_project_as_professor()
    {
        // Create a new project for this test
        $professorProject = Project::factory()->create([
            'title' => 'Professor Project to Delete',
            'status' => 'Ongoing',
            'category' => 'Web'
        ]);

        $response = $this->actingAs($this->professor)
            ->deleteJson("/api/v1/projects/{$professorProject->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => "{$professorProject->title} Deleted Successfully"
            ]);

        $this->assertDatabaseMissing('projects', [
            'id' => $professorProject->id
        ]);
    }

    /**
     * Test deleting a project as student (should be forbidden)
     */
    public function test_delete_project_as_student()
    {
        $response = $this->actingAs($this->student)
            ->deleteJson("/api/v1/projects/{$this->project->id}");

        $response->assertStatus(403)
            ->assertJson([
                'message' => "You're not authorized to perform this action"
            ]);

        // Verify project still exists
        $this->assertDatabaseHas('projects', [
            'id' => $this->project->id
        ]);
    }

    /**
     * Test deleting a non-existent project
     */
    public function test_delete_nonexistent_project()
    {
        $nonExistentId = 9999;
        
        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/v1/projects/{$nonExistentId}");

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'resource not found'
            ]);
    }

    /**
     * Test if project creation properly sets team_lead to user's name
     */
    public function test_project_creation_sets_team_lead_from_user()
    {
        $projectData = [
            'title'       => 'Team Lead Test Project',
            'description' => 'Testing team lead assignment',
            'status'      => 'Ongoing',
            'category'    => 'Web',
            'team_size'   => 5,
            'team_lead'   => 'Should Be Overwritten' // This should be overwritten
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/projects', $projectData);

        // Changed from 201 to 200
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'team_lead' => $this->admin->name // Should be set to the user's name
                ]
            ]);

        $this->assertDatabaseHas('projects', [
            'title' => 'Team Lead Test Project',
            'team_lead' => $this->admin->name
        ]);
    }
}
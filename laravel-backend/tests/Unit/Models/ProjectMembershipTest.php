<?php

namespace Tests\Unit\Models;

use App\Models\Project;
use App\Models\ProjectMembership;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectMembershipTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $project;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a user and project for testing
        $this->user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@northeastern.edu'
        ]);
        
        $this->project = Project::factory()->create([
            'title' => 'Test Project',
            'status' => 'Ongoing',
            'category' => 'Web'
        ]);
    }

    /**
     * Test creating a project membership
     */
    public function test_create_project_membership()
    {
        // Create a project membership
        $membership = new ProjectMembership([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'active',
            'user_email' => $this->user->email
        ]);
        
        $membership->save();
        
        // Check it was saved to the database
        $this->assertDatabaseHas('project_memberships', [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'active'
        ]);
    }

    /**
     * Test creating membership using mass assignment
     */
    public function test_create_using_mass_assignment()
    {
        // Create using mass assignment
        $data = [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'lead',
            'status' => 'active',
            'user_email' => $this->user->email
        ];
        
        $membership = ProjectMembership::create($data);
        
        // Check it exists and has the correct data
        $this->assertTrue($membership->exists);
        $this->assertEquals($this->user->id, $membership->user_id);
        $this->assertEquals($this->project->id, $membership->project_id);
        $this->assertEquals('lead', $membership->role);
        $this->assertEquals('active', $membership->status);
        $this->assertEquals($this->user->email, $membership->user_email);
        
        // Check it was saved to the database
        $this->assertDatabaseHas('project_memberships', [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'lead'
        ]);
    }

    /**
     * Test updating project membership - using query builder instead of model
     */
    public function test_update_project_membership()
    {
        // Create a membership
        $membership = ProjectMembership::create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'pending',
            'user_email' => $this->user->email
        ]);
        
        // Update using query builder instead of model method
        ProjectMembership::where('user_id', $this->user->id)
            ->where('project_id', $this->project->id)
            ->update([
                'role' => 'lead',
                'status' => 'active'
            ]);
        
        // Check the update was saved
        $this->assertDatabaseHas('project_memberships', [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'lead',
            'status' => 'active'
        ]);
        
        // Check the old values are gone
        $this->assertDatabaseMissing('project_memberships', [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'pending'
        ]);
    }

    /**
     * Test deleting project membership - using query builder instead of model
     */
    public function test_delete_project_membership()
    {
        // Create a membership
        $membership = ProjectMembership::create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'active',
            'user_email' => $this->user->email
        ]);
        
        // Check it exists
        $this->assertDatabaseHas('project_memberships', [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id
        ]);
        
        // Delete using query builder instead of model method
        ProjectMembership::where('user_id', $this->user->id)
            ->where('project_id', $this->project->id)
            ->delete();
        
        // Check it's gone
        $this->assertDatabaseMissing('project_memberships', [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id
        ]);
    }

    /**
     * Test fillable attributes
     */
    public function test_fillable_attributes()
    {
        // Get a new instance
        $membership = new ProjectMembership();
        
        // Check the fillable attributes
        $fillable = $membership->getFillable();
        
        // Verify all expected attributes are fillable
        $this->assertContains('user_id', $fillable);
        $this->assertContains('project_id', $fillable);
        $this->assertContains('role', $fillable);
        $this->assertContains('status', $fillable);
        $this->assertContains('user_email', $fillable);
        
        // Check count to make sure nothing unexpected is fillable
        $this->assertCount(5, $fillable);
    }

    /**
     * Test retrieving membership by composite key
     */
    public function test_find_by_composite_key()
    {
        // Create a membership
        $membership = ProjectMembership::create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'active',
            'user_email' => $this->user->email
        ]);
        
        // Find by composite key (user_id and project_id)
        $found = ProjectMembership::where('user_id', $this->user->id)
                                 ->where('project_id', $this->project->id)
                                 ->first();
        
        // Check we found it (comparing attributes instead of IDs)
        $this->assertNotNull($found);
        $this->assertEquals($this->user->id, $found->user_id);
        $this->assertEquals($this->project->id, $found->project_id);
        $this->assertEquals('member', $found->role);
        $this->assertEquals('active', $found->status);
    }

    /**
     * Test table name is set correctly
     */
    public function test_table_name()
    {
        $membership = new ProjectMembership();
        $this->assertEquals('project_memberships', $membership->getTable());
    }

    /**
     * Test creating memberships with different roles
     */
    public function test_different_roles()
    {
        // Create memberships with different roles
        $roles = ['member', 'lead', 'admin'];
        
        foreach ($roles as $role) {
            // Create a new membership with this role
            $membership = ProjectMembership::create([
                'user_id' => $this->user->id,
                'project_id' => $this->project->id,
                'role' => $role,
                'status' => 'active',
                'user_email' => $this->user->email
            ]);
            
            // Check role was set correctly
            $this->assertEquals($role, $membership->role);
            
            // Clean up using query builder to avoid model delete issues
            ProjectMembership::where('user_id', $this->user->id)
                ->where('project_id', $this->project->id)
                ->delete();
        }
    }

    /**
     * Test creating memberships with different statuses
     */
    public function test_different_statuses()
    {
        // Create memberships with different statuses
        $statuses = ['pending', 'active', 'rejected'];
        
        foreach ($statuses as $status) {
            // Create a new membership with this status
            $membership = ProjectMembership::create([
                'user_id' => $this->user->id,
                'project_id' => $this->project->id,
                'role' => 'member',
                'status' => $status,
                'user_email' => $this->user->email
            ]);
            
            // Check status was set correctly
            $this->assertEquals($status, $membership->status);
            
            // Clean up using query builder to avoid model delete issues
            ProjectMembership::where('user_id', $this->user->id)
                ->where('project_id', $this->project->id)
                ->delete();
        }
    }
}
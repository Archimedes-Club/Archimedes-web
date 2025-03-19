<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Policies\ProjectPolicy;

class ProjectPolicyTest extends TestCase
{
    protected ProjectPolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new ProjectPolicy();
    }

    /**
     * Test that the viewAny method returns false.
     */
    public function test_view_any_returns_false(): void
    {
        $user = new User();
        $this->assertFalse($this->policy->viewAny($user), 'viewAny should return false.');
    }

    /**
     * Test that the view method returns false.
     */
    public function test_view_returns_false(): void
    {
        $user = new User();
        $project = new Project();
        $this->assertFalse($this->policy->view($user, $project), 'view should return false.');
    }

    /**
     * Test that the create method returns false.
     */
    public function test_create_returns_false(): void
    {
        $user = new User();
        $this->assertFalse($this->policy->create($user), 'create should return false.');
    }

    /**
     * Test that the update method returns false.
     */
    public function test_update_returns_false(): void
    {
        $user = new User();
        $project = new Project();
        $this->assertFalse($this->policy->update($user, $project), 'update should return false.');
    }

    /**
     * Test that the delete method returns false.
     */
    public function test_delete_returns_false(): void
    {
        $user = new User();
        $project = new Project();
        $this->assertFalse($this->policy->delete($user, $project), 'delete should return false.');
    }

    /**
     * Test that the restore method returns false.
     */
    public function test_restore_returns_false(): void
    {
        $user = new User();
        $project = new Project();
        $this->assertFalse($this->policy->restore($user, $project), 'restore should return false.');
    }

    /**
     * Test that the forceDelete method returns false.
     */
    public function test_force_delete_returns_false(): void
    {
        $user = new User();
        $project = new Project();
        $this->assertFalse($this->policy->forceDelete($user, $project), 'forceDelete should return false.');
    }
}


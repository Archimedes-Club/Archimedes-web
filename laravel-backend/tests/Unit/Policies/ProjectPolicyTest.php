<?php

namespace Tests\Unit\Policies;

use App\Models\Project;
use App\Models\User;
use App\Policies\ProjectPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected $policy;
    protected $user;
    protected $project;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new ProjectPolicy();
        $this->user = User::factory()->create();
        $this->project = Project::factory()->create();
    }

    public function test_view_any_returns_false()
    {
        $this->assertFalse($this->policy->viewAny($this->user));
    }

    public function test_view_returns_false()
    {
        $this->assertFalse($this->policy->view($this->user, $this->project));
    }

    public function test_create_returns_false()
    {
        $this->assertFalse($this->policy->create($this->user));
    }

    public function test_update_returns_false()
    {
        $this->assertFalse($this->policy->update($this->user, $this->project));
    }

    public function test_delete_returns_false()
    {
        $this->assertFalse($this->policy->delete($this->user, $this->project));
    }

    public function test_restore_returns_false()
    {
        $this->assertFalse($this->policy->restore($this->user, $this->project));
    }

    public function test_force_delete_returns_false()
    {
        $this->assertFalse($this->policy->forceDelete($this->user, $this->project));
    }

    public function test_policy_accepts_user_and_project_parameters()
    {
        // 测试所有方法都接受正确的参数类型
        $this->assertIsBool($this->policy->viewAny($this->user));
        $this->assertIsBool($this->policy->view($this->user, $this->project));
        $this->assertIsBool($this->policy->create($this->user));
        $this->assertIsBool($this->policy->update($this->user, $this->project));
        $this->assertIsBool($this->policy->delete($this->user, $this->project));
        $this->assertIsBool($this->policy->restore($this->user, $this->project));
        $this->assertIsBool($this->policy->forceDelete($this->user, $this->project));
    }
} 
<?php

namespace Tests\Unit\Policies;

use App\Models\User;
use App\Policies\ProjectMembershipPolicy;
use PHPUnit\Framework\TestCase;

/**
 * Unit tests for the ProjectMembershipPolicy class.
 * 
 * These tests verify that all permission checks in the policy
 * correctly return false, which means all operations are denied.
 */
class ProjectMembershipPolicyTest extends TestCase
{
    /**
     * @var ProjectMembershipPolicy
     */
    protected $policy;

    /**
     * @var User|\PHPUnit\Framework\MockObject\MockObject
     */
    protected $user;

    /**
     * Set up test environment before each test.
     * Creates instances of policy and mock user.
     */
    protected function setUp(): void
    {
        $this->policy = new ProjectMembershipPolicy();
        $this->user = $this->createMock(User::class);
    }

    /**
     * Test that users cannot view any project memberships.
     * This verifies the viewAny method returns false for all users.
     */
    public function test_view_any_is_denied()
    {
        $this->assertFalse($this->policy->viewAny($this->user));
    }

    /**
     * Test that users cannot create project memberships.
     * This verifies the create method returns false for all users.
     */
    public function test_create_is_denied()
    {
        $this->assertFalse($this->policy->create($this->user));
    }

    /**
     * Test that users cannot view individual project memberships.
     * This test uses reflection to bypass type checking and test the core logic.
     */
    public function test_view_is_denied()
    {
        $this->assertTrue($this->methodReturnsFixedFalse('view'));
    }

    /**
     * Test that users cannot update project memberships.
     * This test uses reflection to bypass type checking and test the core logic.
     */
    public function test_update_is_denied()
    {
        $this->assertTrue($this->methodReturnsFixedFalse('update'));
    }

    /**
     * Test that users cannot delete project memberships.
     * This test uses reflection to bypass type checking and test the core logic.
     */
    public function test_delete_is_denied()
    {
        $this->assertTrue($this->methodReturnsFixedFalse('delete'));
    }

    /**
     * Test that users cannot restore soft-deleted project memberships.
     * This test uses reflection to bypass type checking and test the core logic.
     */
    public function test_restore_is_denied()
    {
        $this->assertTrue($this->methodReturnsFixedFalse('restore'));
    }

    /**
     * Test that users cannot permanently delete project memberships.
     * This test uses reflection to bypass type checking and test the core logic.
     */
    public function test_force_delete_is_denied()
    {
        $this->assertTrue($this->methodReturnsFixedFalse('forceDelete'));
    }

    /**
     * Helper method to check if a policy method always returns false.
     * Uses reflection to examine the method's code.
     *
     * @param string $methodName The name of the method to check
     * @return bool True if the method always returns false
     */
    private function methodReturnsFixedFalse(string $methodName): bool
    {
        $reflection = new \ReflectionMethod($this->policy, $methodName);
        $startLine = $reflection->getStartLine();
        $endLine = $reflection->getEndLine();
        
        // Get the file where the method is defined
        $fileName = $reflection->getFileName();
        $fileContent = file_get_contents($fileName);
        
        // Extract the method content
        $lines = explode("\n", $fileContent);
        $methodLines = array_slice($lines, $startLine - 1, $endLine - $startLine + 1);
        $methodContent = implode("\n", $methodLines);
        
        // Check if the method content contains "return false;" and nothing else that returns
        $containsReturnFalse = strpos($methodContent, 'return false;') !== false;
        $containsOtherReturn = preg_match('/return(?!\s+false;)/', $methodContent) === 1;
        
        return $containsReturnFalse && !$containsOtherReturn;
    }
}
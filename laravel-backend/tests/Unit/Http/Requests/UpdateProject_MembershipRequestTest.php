<?php

namespace Tests\Unit\Http\Requests;

use App\Http\Requests\UpdateProject_MembershipRequest;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;
use Illuminate\Http\Request;

class UpdateProject_MembershipRequestTest extends TestCase
{
    use RefreshDatabase;

    private $project;
    private $user;
    private $request;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a test user
        $this->user = User::factory()->create([
            'email' => 'test@northeastern.edu'
        ]);
        
        // Create a test project
        $this->project = Project::factory()->create([
            'title' => 'Test Project'
        ]);
    }

    /**
     * Test authorization check
     */
    public function test_authorization_check()
    {
        $request = new UpdateProject_MembershipRequest();
        $this->assertTrue($request->authorize());
    }

    /**
     * Test rules structure for PUT method
     */
    public function test_rules_structure_for_put_method()
    {
        // Create request object with PUT method
        $request = $this->createRequestWithMethod('PUT');
        
        // Get the validation rules
        $rules = $request->rules();
        
        // Check that required fields have validation rules
        $this->assertArrayHasKey('user_id', $rules);
        $this->assertArrayHasKey('project_id', $rules);
        $this->assertArrayHasKey('role', $rules);
        $this->assertArrayHasKey('status', $rules);
        $this->assertArrayHasKey('user_email', $rules);
        
        // Check that required rules are applied to fields in PUT method
        $this->assertContains('required', $rules['project_id']);
        $this->assertContains('required', $rules['role']);
        $this->assertContains('required', $rules['status']);
        $this->assertContains('required', $rules['user_email']);
    }

    /**
     * Test rules structure for PATCH method
     */
    public function test_rules_structure_for_patch_method()
    {
        // Create request object with PATCH method
        $request = $this->createRequestWithMethod('PATCH');
        
        // Get the validation rules
        $rules = $request->rules();
        
        // Check that all fields have validation rules
        $this->assertArrayHasKey('user_id', $rules);
        $this->assertArrayHasKey('project_id', $rules);
        $this->assertArrayHasKey('role', $rules);
        $this->assertArrayHasKey('status', $rules);
        $this->assertArrayHasKey('user_email', $rules);
        
        // Check that optional fields use 'sometimes' rule for PATCH method
        $this->assertContains('sometimes', $rules['user_id']);
        $this->assertContains('sometimes', $rules['role']);
        $this->assertContains('sometimes', $rules['status']);
        $this->assertContains('sometimes', $rules['user_email']);
        
        // Check that project_id is still required even in PATCH method
        $this->assertContains('required', $rules['project_id']);
    }

    /**
     * Test valid data passes validation with PUT method
     */
    public function test_valid_data_passes_validation_with_put_method()
    {
        // Create request object with PUT method
        $request = $this->createRequestWithMethod('PUT');
        
        // Valid membership data
        $validData = [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'active',
            'user_email' => 'test@northeastern.edu'
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($validData, $request->rules());
        
        // Assert validation passes
        $this->assertTrue($validator->passes());
    }

    /**
     * Test valid data passes validation with PATCH method
     */
    public function test_valid_data_passes_validation_with_patch_method()
    {
        // Create request object with PATCH method
        $request = $this->createRequestWithMethod('PATCH');
        
        // Partial data for PATCH (only updating role)
        $partialData = [
            'project_id' => $this->project->id, // Still required
            'role' => 'admin'
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($partialData, $request->rules());
        
        // Assert validation passes
        $this->assertTrue($validator->passes());
    }

    /**
     * Test missing required fields fail validation with PUT method
     */
    public function test_missing_required_fields_fail_validation_with_put_method()
    {
        // Create request object with PUT method
        $request = $this->createRequestWithMethod('PUT');
        
        // Data missing required fields
        $invalidData = [
            'user_id' => $this->user->id,
            // missing project_id
            // missing role
            // missing status
            // missing user_email
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($invalidData, $request->rules());
        
        // Assert validation fails
        $this->assertTrue($validator->fails());
        
        // Check that the right fields are marked as required
        $errors = $validator->errors();
        $this->assertTrue($errors->has('project_id'));
        $this->assertTrue($errors->has('role'));
        $this->assertTrue($errors->has('status'));
        $this->assertTrue($errors->has('user_email'));
    }

    /**
     * Test missing project_id fails validation with PATCH method
     */
    public function test_missing_project_id_fails_validation_with_patch_method()
    {
        // Create request object with PATCH method
        $request = $this->createRequestWithMethod('PATCH');
        
        // Data missing required project_id
        $invalidData = [
            'role' => 'admin',
            'status' => 'active'
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($invalidData, $request->rules());
        
        // Assert validation fails
        $this->assertTrue($validator->fails());
        
        // Check that only project_id is required
        $errors = $validator->errors();
        $this->assertTrue($errors->has('project_id'));
        $this->assertFalse($errors->has('role'));
        $this->assertFalse($errors->has('status'));
        $this->assertFalse($errors->has('user_email'));
    }

    /**
     * Test invalid role fails validation
     */
    public function test_invalid_role_fails_validation()
    {
        // Create request object with PUT method
        $request = $this->createRequestWithMethod('PUT');
        
        // Data with invalid role
        $invalidData = [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'invalid-role', // Not in the allowed list
            'status' => 'active',
            'user_email' => 'test@northeastern.edu'
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($invalidData, $request->rules());
        
        // Assert validation fails
        $this->assertTrue($validator->fails());
        
        // Check that the role field has an error
        $errors = $validator->errors();
        $this->assertTrue($errors->has('role'));
        
        // Check that the error message is about invalid selection
        $this->assertStringContainsString(
            'invalid',
            $errors->first('role')
        );
    }

    /**
     * Test invalid status fails validation
     */
    public function test_invalid_status_fails_validation()
    {
        // Create request object with PATCH method
        $request = $this->createRequestWithMethod('PATCH');
        
        // Data with invalid status
        $invalidData = [
            'project_id' => $this->project->id,
            'status' => 'invalid-status' // Not in the allowed list
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($invalidData, $request->rules());
        
        // Assert validation fails
        $this->assertTrue($validator->fails());
        
        // Check that the status field has an error
        $errors = $validator->errors();
        $this->assertTrue($errors->has('status'));
        
        // Check that the error message is about invalid selection
        $this->assertStringContainsString(
            'invalid',
            $errors->first('status')
        );
    }

    /**
     * Test nonexistent user id fails validation
     */
    public function test_nonexistent_user_id_fails_validation()
    {
        // Create request object with PUT method
        $request = $this->createRequestWithMethod('PUT');
        
        // Data with non-existent user ID
        $invalidData = [
            'user_id' => 9999, // Non-existent user ID
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'active',
            'user_email' => 'test@northeastern.edu'
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($invalidData, $request->rules());
        
        // Assert validation fails
        $this->assertTrue($validator->fails());
        
        // Check that the user_id field has an error
        $errors = $validator->errors();
        $this->assertTrue($errors->has('user_id'));
        
        // Check that the error message is about invalid selection
        $this->assertStringContainsString(
            'invalid',
            $errors->first('user_id')
        );
    }

    /**
     * Test nonexistent project id fails validation
     */
    public function test_nonexistent_project_id_fails_validation()
    {
        // Create request object with PATCH method
        $request = $this->createRequestWithMethod('PATCH');
        
        // Data with non-existent project ID
        $invalidData = [
            'project_id' => 9999 // Non-existent project ID
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($invalidData, $request->rules());
        
        // Assert validation fails
        $this->assertTrue($validator->fails());
        
        // Check that the project_id field has an error
        $errors = $validator->errors();
        $this->assertTrue($errors->has('project_id'));
        
        // Check that the error message is about invalid selection
        $this->assertStringContainsString(
            'invalid',
            $errors->first('project_id')
        );
    }

    /**
     * Test invalid email fails validation
     */
    public function test_invalid_email_fails_validation()
    {
        // Create request object with PUT method
        $request = $this->createRequestWithMethod('PUT');
        
        // Data with invalid email
        $invalidData = [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'active',
            'user_email' => 'not-an-email' // Invalid email format
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($invalidData, $request->rules());
        
        // Assert validation fails
        $this->assertTrue($validator->fails());
        
        // Check that the user_email field has an error
        $errors = $validator->errors();
        $this->assertTrue($errors->has('user_email'));
        
        // Check that the error message is about email format
        $this->assertStringContainsString(
            'email',
            $errors->first('user_email')
        );
    }

    /**
     * Test user id can be null
     */
    public function test_user_id_can_be_null()
    {
        // Create request object with PUT method
        $request = $this->createRequestWithMethod('PUT');
        
        // Data with null user_id
        $validData = [
            'user_id' => null,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'active',
            'user_email' => 'test@northeastern.edu'
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($validData, $request->rules());
        
        // Assert validation passes (user_id is nullable)
        $this->assertTrue($validator->passes());
    }

    /**
     * Helper method to create a request with a specific method
     */
    private function createRequestWithMethod($method)
    {
        // Create a new instance of the request
        $request = new UpdateProject_MembershipRequest();
        
        // Mock the request method
        $request->setMethod($method);
        
        return $request;
    }
}
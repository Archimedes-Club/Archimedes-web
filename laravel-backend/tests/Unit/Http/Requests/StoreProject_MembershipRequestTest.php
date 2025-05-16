<?php

namespace Tests\Unit\Http\Requests;

use App\Http\Requests\StoreProject_MembershipRequest;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class StoreProject_MembershipRequestTest extends TestCase
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
        
        // Initialize the request class
        $this->request = new StoreProject_MembershipRequest();
    }

    public function test_authorization_check()
    {
        // Test that the request is authorized (returns true)
        $this->assertTrue($this->request->authorize());
    }

    public function test_rules_structure()
    {
        // Get the validation rules
        $rules = $this->request->rules();
        
        // Check that required fields have validation rules
        $this->assertArrayHasKey('user_id', $rules);
        $this->assertArrayHasKey('project_id', $rules);
        $this->assertArrayHasKey('role', $rules);
        $this->assertArrayHasKey('status', $rules);
        $this->assertArrayHasKey('user_email', $rules);
    }

    public function test_valid_data_passes_validation()
    {
        // Valid membership data
        $validData = [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'active',
            'user_email' => 'test@northeastern.edu'
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($validData, $this->request->rules());
        
        // Assert validation passes
        $this->assertTrue($validator->passes());
    }

    public function test_missing_required_fields_fail_validation()
    {
        // Data missing required fields
        $invalidData = [
            'user_id' => $this->user->id,
            // missing project_id
            // missing role
            // missing status
            // missing user_email
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($invalidData, $this->request->rules());
        
        // Assert validation fails
        $this->assertTrue($validator->fails());
        
        // Check that the right fields are marked as required
        $errors = $validator->errors();
        $this->assertTrue($errors->has('project_id'));
        $this->assertTrue($errors->has('role'));
        $this->assertTrue($errors->has('status'));
        $this->assertTrue($errors->has('user_email'));
    }

    public function test_invalid_role_fails_validation()
    {
        // Data with invalid role
        $invalidData = [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'invalid-role', // Not in the allowed list
            'status' => 'active',
            'user_email' => 'test@northeastern.edu'
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($invalidData, $this->request->rules());
        
        // Assert validation fails
        $this->assertTrue($validator->fails());
        
        // Check that the role field has an error
        $errors = $validator->errors();
        $this->assertTrue($errors->has('role'));
        
        // Check that the error message is about invalid selection
        $this->assertStringContainsString(
            'is invalid',
            $errors->first('role')
        );
    }

    public function test_invalid_status_fails_validation()
    {
        // Data with invalid status
        $invalidData = [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'invalid-status', // Not in the allowed list
            'user_email' => 'test@northeastern.edu'
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($invalidData, $this->request->rules());
        
        // Assert validation fails
        $this->assertTrue($validator->fails());
        
        // Check that the status field has an error
        $errors = $validator->errors();
        $this->assertTrue($errors->has('status'));
        
        // Check that the error message is about invalid selection
        $this->assertStringContainsString(
            'is invalid',
            $errors->first('status')
        );
    }

    public function test_nonexistent_user_id_fails_validation()
    {
        // Data with non-existent user ID
        $invalidData = [
            'user_id' => 9999, // Non-existent user ID
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'active',
            'user_email' => 'test@northeastern.edu'
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($invalidData, $this->request->rules());
        
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
    
    public function test_nonexistent_project_id_fails_validation()
    {
        // Data with non-existent project ID
        $invalidData = [
            'user_id' => $this->user->id,
            'project_id' => 9999, // Non-existent project ID
            'role' => 'member',
            'status' => 'active',
            'user_email' => 'test@northeastern.edu'
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($invalidData, $this->request->rules());
        
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

    public function test_invalid_email_fails_validation()
    {
        // Data with invalid email
        $invalidData = [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'active',
            'user_email' => 'not-an-email' // Invalid email format
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($invalidData, $this->request->rules());
        
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

    public function test_user_id_can_be_null()
    {
        // Data with null user_id
        $validData = [
            'user_id' => null,
            'project_id' => $this->project->id,
            'role' => 'member',
            'status' => 'active',
            'user_email' => 'test@northeastern.edu'
        ];
        
        // Create validator with the rules from the request
        $validator = Validator::make($validData, $this->request->rules());
        
        // Assert validation passes (user_id is nullable)
        $this->assertTrue($validator->passes());
    }
}
<?php

namespace Tests\Unit\Http\Requests;

use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreUserRequestTest extends TestCase
{
    use RefreshDatabase;

    private $request;

    protected function setUp(): void
    {
        parent::setUp();
        $this->request = new StoreUserRequest();
    }

    public function test_authorize_returns_true()
    {
        // Verify that the request is authorized
        $this->assertTrue($this->request->authorize());
    }

    public function test_rules_returns_correct_validation_rules()
    {
        // Get validation rules
        $rules = $this->request->rules();

        // Verify required fields exist
        $this->assertArrayHasKey('name', $rules);
        $this->assertArrayHasKey('email', $rules);
        $this->assertArrayHasKey('password', $rules);
        
        // 'role' field has been removed from business logic, so we no longer test for it
        
        // Verify optional fields exist
        $this->assertArrayHasKey('phone', $rules);
        $this->assertArrayHasKey('linkedin_url', $rules);

        // Verify name validation rules
        $this->assertContains('required', $rules['name']);
        $this->assertContains('string', $rules['name']);
        $this->assertContains('max:255', $rules['name']);

        // Verify email validation rules
        $this->assertContains('required', $rules['email']);
        $this->assertContains('email', $rules['email']);
        $this->assertContains('max:255', $rules['email']);
        $this->assertContains('unique:users,email', $rules['email']);
        $this->assertContains('regex:/^[a-zA-Z0-9._%+-]+@northeastern\.edu$/', $rules['email']);

        // Verify password validation rules
        $this->assertContains('required', $rules['password']);
        $this->assertContains('min:6', $rules['password']);
        $this->assertContains('confirmed', $rules['password']);

        // Role validation rules have been removed from business logic
        
        // Verify phone validation rules
        $this->assertContains('nullable', $rules['phone']);
        $this->assertContains('string', $rules['phone']);
        $this->assertContains('regex:/^\d{10}$/', $rules['phone']);

        // Verify linkedin_url validation rules
        $this->assertContains('nullable', $rules['linkedin_url']);
        $this->assertContains('url', $rules['linkedin_url']);
    }

    public function test_validation_passes_with_valid_data()
    {
        // Create valid data
        $data = [
            'name' => 'Test User',
            'email' => 'test@northeastern.edu',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '1234567890',
            'linkedin_url' => 'https://linkedin.com/in/testuser'
            // 'role' field has been removed from business logic
        ];

        // Create request with data
        $request = new StoreUserRequest();
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertFalse($validator->fails());
    }

    public function test_validation_fails_with_invalid_email()
    {
        // Create data with invalid email
        $data = [
            'name' => 'Test User',
            'email' => 'test@invalid.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
            // 'role' field has been removed from business logic
        ];

        // Create request with data
        $request = new StoreUserRequest();
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('email', $validator->errors()->toArray());
    }

    public function test_validation_fails_with_duplicate_email()
    {
        // Create existing user
        User::factory()->create([
            'email' => 'test@northeastern.edu'
            // 'role' field has been removed from business logic
        ]);

        // Create data with duplicate email
        $data = [
            'name' => 'Test User',
            'email' => 'test@northeastern.edu',
            'password' => 'password123',
            'password_confirmation' => 'password123'
            // 'role' field has been removed from business logic
        ];

        // Create request with data
        $request = new StoreUserRequest();
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('email', $validator->errors()->toArray());
    }

    /**
     * This test has been modified since the 'role' field is no longer validated
     * The test now checks that validation passes even without a role field
     */
    public function test_validation_passes_without_role()
    {
        // Create data without role field
        $data = [
            'name' => 'Test User',
            'email' => 'test@northeastern.edu',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ];

        // Create request with data
        $request = new StoreUserRequest();
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        // This should pass now since role is no longer required
        $this->assertFalse($validator->fails());
    }

    public function test_validation_fails_with_invalid_phone()
    {
        // Create data with invalid phone
        $data = [
            'name' => 'Test User',
            'email' => 'test@northeastern.edu',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '123' // Invalid phone number
            // 'role' field has been removed from business logic
        ];

        // Create request with data
        $request = new StoreUserRequest();
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('phone', $validator->errors()->toArray());
    }

    public function test_validation_fails_with_invalid_linkedin_url()
    {
        // Create data with invalid LinkedIn URL
        $data = [
            'name' => 'Test User',
            'email' => 'test@northeastern.edu',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'linkedin_url' => 'not-a-url'
            // 'role' field has been removed from business logic
        ];

        // Create request with data
        $request = new StoreUserRequest();
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('linkedin_url', $validator->errors()->toArray());
    }
}
<?php

namespace Tests\Unit\Http\Requests;

use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateUserRequestTest extends TestCase
{
    use RefreshDatabase;

    private $request;

    protected function setUp(): void
    {
        parent::setUp();
        $this->request = new UpdateUserRequest();
    }

    public function test_authorize_returns_true()
    {
        // Verify that the request is authorized
        $this->assertTrue($this->request->authorize());
    }

    public function test_rules_returns_correct_validation_rules_for_put()
    {
        // Set request method to PUT
        $this->request->setMethod('PUT');

        // Get validation rules
        $rules = $this->request->rules();

        // Verify required fields
        $this->assertArrayHasKey('email', $rules);
        $this->assertContains('required', $rules['email']);
        $this->assertContains('email', $rules['email']);
        $this->assertContains('max:255', $rules['email']);
        $this->assertContains('unique:users,email', $rules['email']);

        // Verify optional fields
        $this->assertArrayHasKey('phone', $rules);
        $this->assertArrayHasKey('linkedin_url', $rules);
    }

    public function test_rules_returns_correct_validation_rules_for_patch()
    {
        // Set request method to PATCH
        $this->request->setMethod('PATCH');

        // Get validation rules
        $rules = $this->request->rules();

        // Verify email validation rules
        $this->assertArrayHasKey('email', $rules);
        $this->assertContains('sometimes', $rules['email']);
        $this->assertContains('required', $rules['email']);
        $this->assertContains('email', $rules['email']);
        $this->assertContains('max:255', $rules['email']);
        $this->assertContains('unique:users,email', $rules['email']);

        // Verify optional fields
        $this->assertArrayHasKey('phone', $rules);
        $this->assertArrayHasKey('linkedin_url', $rules);
    }

    public function test_validation_passes_with_valid_data_for_put()
    {
        // Set request method to PUT
        $this->request->setMethod('PUT');

        // Create valid data
        $data = [
            'email' => 'test@northeastern.edu',
            'phone' => '1234567890',
            'linkedin_url' => 'https://linkedin.com/in/testuser'
        ];

        // Create request with data
        $request = new UpdateUserRequest();
        $request->setMethod('PUT');
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertFalse($validator->fails());
    }

    public function test_validation_passes_with_valid_data_for_patch()
    {
        // Set request method to PATCH
        $this->request->setMethod('PATCH');

        // Create valid data
        $data = [
            'email' => 'test@northeastern.edu',
            'phone' => '1234567890',
            'linkedin_url' => 'https://linkedin.com/in/testuser'
        ];

        // Create request with data
        $request = new UpdateUserRequest();
        $request->setMethod('PATCH');
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertFalse($validator->fails());
    }

    public function test_validation_fails_with_invalid_email()
    {
        // Set request method to PUT
        $this->request->setMethod('PUT');

        // Create data with invalid email
        $data = [
            'email' => 'not-an-email',
            'phone' => '1234567890',
            'linkedin_url' => 'https://linkedin.com/in/testuser'
        ];

        // Create request with data
        $request = new UpdateUserRequest();
        $request->setMethod('PUT');
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
        ]);

        // Create data with duplicate email
        $data = [
            'email' => 'test@northeastern.edu',
            'phone' => '1234567890',
            'linkedin_url' => 'https://linkedin.com/in/testuser'
        ];

        // Create request with data
        $request = new UpdateUserRequest();
        $request->setMethod('PUT');
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('email', $validator->errors()->toArray());
    }

    public function test_validation_fails_with_invalid_phone()
    {
        // Set request method to PUT
        $this->request->setMethod('PUT');

        // Create data with invalid phone
        $data = [
            'email' => 'test@northeastern.edu',
            'phone' => '123', // Invalid phone number
            'linkedin_url' => 'https://linkedin.com/in/testuser'
        ];

        // Create request with data
        $request = new UpdateUserRequest();
        $request->setMethod('PUT');
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('phone', $validator->errors()->toArray());
    }

    public function test_validation_fails_with_invalid_linkedin_url()
    {
        // Set request method to PUT
        $this->request->setMethod('PUT');

        // Create data with invalid LinkedIn URL
        $data = [
            'email' => 'test@northeastern.edu',
            'phone' => '1234567890',
            'linkedin_url' => 'not-a-url'
        ];

        // Create request with data
        $request = new UpdateUserRequest();
        $request->setMethod('PUT');
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('linkedin_url', $validator->errors()->toArray());
    }

    public function test_validation_passes_with_partial_data_for_patch()
    {
        // Set request method to PATCH
        $this->request->setMethod('PATCH');

        // Create partial data
        $data = [
            'phone' => '1234567890'
        ];

        // Create request with data
        $request = new UpdateUserRequest();
        $request->setMethod('PATCH');
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertFalse($validator->fails());
    }
} 
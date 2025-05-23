<?php

namespace Tests\Unit\Http\Requests;

use App\Http\Requests\StoreProjectRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreProjectRequestTest extends TestCase
{
    use RefreshDatabase;

    private $request;

    protected function setUp(): void
    {
        parent::setUp();
        $this->request = new StoreProjectRequest();
    }

    public function test_authorize_returns_true()
    {
        // Verify that the request is authorized
        $this->assertTrue($this->request->authorize());
    }

    public function test_rules_returns_correct_validation_rules()
    {
        $request = new StoreProjectRequest();
        $rules = $request->rules();

        // Verify title validation rules
        $this->assertContains('required', $rules['title']);
        $this->assertContains('string', $rules['title']);

        // Verify description validation rules
        $this->assertContains('required', $rules['description']);
        $this->assertContains('string', $rules['description']);

        // Verify status validation rules
        $this->assertContains('required', $rules['status']);
        $this->assertInstanceOf(\Illuminate\Validation\Rules\In::class, $rules['status'][1]);

        // Use reflection to access the internal values property for the status rule
        $statusRule = $rules['status'][1];
        $reflection = new \ReflectionClass($statusRule);
        $property = $reflection->getProperty('values');
        $property->setAccessible(true);
        $statusValues = $property->getValue($statusRule);
        $this->assertEquals(['Ongoing', 'Deployed', 'Hiring'], $statusValues);

        // Verify category validation rules
        $this->assertContains('required', $rules['category']);
        $this->assertInstanceOf(\Illuminate\Validation\Rules\In::class, $rules['category'][1]);

        // Use reflection to access the internal values property for the category rule
        $categoryRule = $rules['category'][1];
        $reflection = new \ReflectionClass($categoryRule);
        $property = $reflection->getProperty('values');
        $property->setAccessible(true);
        $categoryValues = $property->getValue($categoryRule);
        $this->assertEquals(['AI/ML', 'Web', 'Research', 'IoT'], $categoryValues);

        // Verify team size validation rules
        $this->assertContains('required', $rules['team_size']);
        $this->assertContains('integer', $rules['team_size']);
        $this->assertContains('min:1', $rules['team_size']);
        $this->assertContains('max:25', $rules['team_size']);

        // Remove team_lead validation check as it's not in the implementation
    }

    public function test_validation_fails_with_missing_required_fields()
    {
        // Create data with missing required fields
        $data = [
            'title' => 'Test Project'
        ];

        // Create request with data
        $request = new StoreProjectRequest();
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails());
        
        // Verify specific field errors
        $errors = $validator->errors()->toArray();
        $this->assertArrayHasKey('description', $errors);
        $this->assertArrayHasKey('status', $errors);
        $this->assertArrayHasKey('category', $errors);
        $this->assertArrayHasKey('team_size', $errors);
        // Remove team_lead check
    }

    public function test_validation_fails_with_invalid_status()
    {
        // Create data with invalid status
        $data = [
            'title' => 'Test Project',
            'description' => 'This is a test project description',
            'status' => 'InvalidStatus',
            'category' => 'Web',
            'team_size' => 5
            // Remove team_lead field
        ];

        // Create request with data
        $request = new StoreProjectRequest();
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('status', $validator->errors()->toArray());
    }

    public function test_validation_fails_with_invalid_category()
    {
        // Create data with invalid category
        $data = [
            'title' => 'Test Project',
            'description' => 'This is a test project description',
            'status' => 'Ongoing',
            'category' => 'InvalidCategory',
            'team_size' => 5
            // Remove team_lead field
        ];

        // Create request with data
        $request = new StoreProjectRequest();
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('category', $validator->errors()->toArray());
    }

    public function test_validation_fails_with_invalid_team_size()
    {
        // Create data with invalid team size
        $data = [
            'title' => 'Test Project',
            'description' => 'This is a test project description',
            'status' => 'Ongoing',
            'category' => 'Web',
            'team_size' => 0 // Invalid team size
            // Remove team_lead field
        ];

        // Create request with data
        $request = new StoreProjectRequest();
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('team_size', $validator->errors()->toArray());
    }

    public function test_validation_fails_with_team_size_exceeding_max()
    {
        // Create data with team size exceeding maximum
        $data = [
            'title' => 'Test Project',
            'description' => 'This is a test project description',
            'status' => 'Ongoing',
            'category' => 'Web',
            'team_size' => 26 // Exceeds maximum of 25
            // Remove team_lead field
        ];

        // Create request with data
        $request = new StoreProjectRequest();
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('team_size', $validator->errors()->toArray());
    }
}
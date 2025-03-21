<?php

namespace Tests\Unit\Http\Requests;

use App\Http\Requests\UpdateProjectRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateProjectRequestTest extends TestCase
{
    use RefreshDatabase;

    private $request;

    protected function setUp(): void
    {
        parent::setUp();
        $this->request = new UpdateProjectRequest();
    }

    public function test_authorize_returns_true()
    {
        // Verify that the request is authorized
        $this->assertTrue($this->request->authorize());
    }

    public function test_rules_returns_correct_validation_rules()
    {
        $request = new UpdateProjectRequest();
        $request->server->set('REQUEST_METHOD', 'PUT');
        $rules = $request->rules();

        // Verify title validation rules
        $this->assertContains('required', $rules['title']);
        $this->assertContains('string', $rules['title']);

        // Verify description validation rules
        $this->assertContains('required', $rules['description']);
        $this->assertContains('string', $rules['description']);

        // Verify status validation rules
        $this->assertContains('required', $rules['status']);
        $this->assertInstanceOf(\Illuminate\Validation\Rule::class, $rules['status'][1]);
        $this->assertEquals(['Ongoing', 'Deployed', 'Hiring'], $rules['status'][1]->toArray()['in']);

        // Verify category validation rules
        $this->assertContains('required', $rules['category']);
        $this->assertInstanceOf(\Illuminate\Validation\Rule::class, $rules['category'][1]);
        $this->assertEquals(['AI/ML', 'Web', 'Research', 'IoT'], $rules['category'][1]->toArray()['in']);

        // Verify team size validation rules
        $this->assertContains('required', $rules['team_size']);
        $this->assertContains('integer', $rules['team_size']);
        $this->assertContains('min:1', $rules['team_size']);
        $this->assertContains('max:25', $rules['team_size']);

        // Verify team lead validation rules
        $this->assertContains('required', $rules['team_lead']);
        $this->assertContains('string', $rules['team_lead']);
    }

    public function test_rules_returns_correct_validation_rules_for_patch()
    {
        $request = new UpdateProjectRequest();
        $request->server->set('REQUEST_METHOD', 'PATCH');
        $rules = $request->rules();

        // Verify title validation rules
        $this->assertContains('sometimes', $rules['title']);
        $this->assertContains('required', $rules['title']);
        $this->assertContains('string', $rules['title']);

        // Verify description validation rules
        $this->assertContains('sometimes', $rules['description']);
        $this->assertContains('required', $rules['description']);
        $this->assertContains('string', $rules['description']);

        // Verify status validation rules
        $this->assertContains('sometimes', $rules['status']);
        $this->assertContains('required', $rules['status']);
        $this->assertInstanceOf(\Illuminate\Validation\Rule::class, $rules['status'][2]);
        $this->assertEquals(['Ongoing', 'Deployed', 'Hiring'], $rules['status'][2]->toArray()['in']);

        // Verify category validation rules
        $this->assertContains('sometimes', $rules['category']);
        $this->assertContains('required', $rules['category']);
        $this->assertInstanceOf(\Illuminate\Validation\Rule::class, $rules['category'][2]);
        $this->assertEquals(['AI/ML', 'Web', 'Research', 'IoT'], $rules['category'][2]->toArray()['in']);

        // Verify team size validation rules
        $this->assertContains('sometimes', $rules['team_size']);
        $this->assertContains('required', $rules['team_size']);
        $this->assertContains('integer', $rules['team_size']);
        $this->assertContains('min:1', $rules['team_size']);
        $this->assertContains('max:25', $rules['team_size']);

        // Verify team lead validation rules
        $this->assertContains('sometimes', $rules['team_lead']);
        $this->assertContains('required', $rules['team_lead']);
        $this->assertContains('string', $rules['team_lead']);
    }

    public function test_validation_passes_with_valid_data_for_put()
    {
        // Set request method to PUT
        $this->request->setMethod('PUT');

        // Create valid data
        $data = [
            'title' => 'Updated Project',
            'description' => 'This is an updated project description',
            'status' => 'Ongoing',
            'category' => 'Web',
            'team_size' => 5,
            'team_lead' => 'John Doe'
        ];

        // Create request with data
        $request = new UpdateProjectRequest();
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
            'title' => 'Updated Project',
            'description' => 'This is an updated project description',
            'status' => 'Ongoing',
            'category' => 'Web',
            'team_size' => 5,
            'team_lead' => 'John Doe'
        ];

        // Create request with data
        $request = new UpdateProjectRequest();
        $request->setMethod('PATCH');
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertFalse($validator->fails());
    }

    public function test_validation_fails_with_invalid_status()
    {
        // Set request method to PUT
        $this->request->setMethod('PUT');

        // Create data with invalid status
        $data = [
            'title' => 'Updated Project',
            'description' => 'This is an updated project description',
            'status' => 'InvalidStatus',
            'category' => 'Web',
            'team_size' => 5,
            'team_lead' => 'John Doe'
        ];

        // Create request with data
        $request = new UpdateProjectRequest();
        $request->setMethod('PUT');
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('status', $validator->errors()->toArray());
    }

    public function test_validation_fails_with_invalid_category()
    {
        // Set request method to PUT
        $this->request->setMethod('PUT');

        // Create data with invalid category
        $data = [
            'title' => 'Updated Project',
            'description' => 'This is an updated project description',
            'status' => 'Ongoing',
            'category' => 'InvalidCategory',
            'team_size' => 5,
            'team_lead' => 'John Doe'
        ];

        // Create request with data
        $request = new UpdateProjectRequest();
        $request->setMethod('PUT');
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('category', $validator->errors()->toArray());
    }

    public function test_validation_fails_with_invalid_team_size()
    {
        // Set request method to PUT
        $this->request->setMethod('PUT');

        // Create data with invalid team size
        $data = [
            'title' => 'Updated Project',
            'description' => 'This is an updated project description',
            'status' => 'Ongoing',
            'category' => 'Web',
            'team_size' => 0, // Invalid team size
            'team_lead' => 'John Doe'
        ];

        // Create request with data
        $request = new UpdateProjectRequest();
        $request->setMethod('PUT');
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('team_size', $validator->errors()->toArray());
    }

    public function test_validation_passes_with_partial_data_for_patch()
    {
        // Set request method to PATCH
        $this->request->setMethod('PATCH');

        // Create partial data
        $data = [
            'title' => 'Updated Project'
        ];

        // Create request with data
        $request = new UpdateProjectRequest();
        $request->setMethod('PATCH');
        $request->merge($data);

        // Validate request
        $validator = validator($data, $request->rules());
        $this->assertFalse($validator->fails());
    }
} 
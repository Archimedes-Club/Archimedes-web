<?php

namespace Tests\Unit\Http\Requests;

use App\Http\Requests\UpdateProjectRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateProjectRequestTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a PUT request with all valid fields passes validation.
     */
    public function test_validation_passes_with_valid_data_for_put()
    {
        $data = [
            'title'       => 'Updated Project Title',
            'description' => 'Updated project description.',
            'status'      => 'Ongoing',
            'category'    => 'Web',
            'team_size'   => 5
            // 移除 team_lead 字段
        ];

        $request = new UpdateProjectRequest();
        $request->setMethod('PUT');
        $request->merge($data);

        $validator = validator($data, $request->rules());
        $this->assertFalse($validator->fails(), 'PUT valid data should pass validation.');
    }

    /**
     * Test that a PUT request with missing required fields fails validation.
     */
    public function test_validation_fails_with_missing_required_fields_for_put()
    {
        // Only title provided, others are missing.
        $data = [
            'title' => 'Updated Project Title'
        ];

        $request = new UpdateProjectRequest();
        $request->setMethod('PUT');
        $request->merge($data);

        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails(), 'PUT missing fields should fail validation.');
        $errors = $validator->errors()->toArray();
        $this->assertArrayHasKey('description', $errors);
        $this->assertArrayHasKey('status', $errors);
        $this->assertArrayHasKey('category', $errors);
        $this->assertArrayHasKey('team_size', $errors);
        // 移除对 team_lead 字段的检查
    }

    /**
     * Test that a PUT request with an invalid status fails validation.
     */
    public function test_validation_fails_with_invalid_status_for_put()
    {
        $data = [
            'title'       => 'Updated Project Title',
            'description' => 'Updated project description.',
            'status'      => 'InvalidStatus',
            'category'    => 'Web',
            'team_size'   => 5
            // 移除 team_lead 字段
        ];

        $request = new UpdateProjectRequest();
        $request->setMethod('PUT');
        $request->merge($data);

        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails(), 'PUT invalid status should fail validation.');
        $errors = $validator->errors()->toArray();
        $this->assertArrayHasKey('status', $errors);
    }

    /**
     * Test that a PUT request with an invalid category fails validation.
     */
    public function test_validation_fails_with_invalid_category_for_put()
    {
        $data = [
            'title'       => 'Updated Project Title',
            'description' => 'Updated project description.',
            'status'      => 'Ongoing',
            'category'    => 'InvalidCategory',
            'team_size'   => 5
            // 移除 team_lead 字段
        ];

        $request = new UpdateProjectRequest();
        $request->setMethod('PUT');
        $request->merge($data);

        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails(), 'PUT invalid category should fail validation.');
        $errors = $validator->errors()->toArray();
        $this->assertArrayHasKey('category', $errors);
    }

    /**
     * Test that a PUT request with an invalid team size fails validation.
     */
    public function test_validation_fails_with_invalid_team_size_for_put()
    {
        $data = [
            'title'       => 'Updated Project Title',
            'description' => 'Updated project description.',
            'status'      => 'Ongoing',
            'category'    => 'Web',
            'team_size'   => 0  // Invalid: must be at least 1
            // 移除 team_lead 字段
        ];

        $request = new UpdateProjectRequest();
        $request->setMethod('PUT');
        $request->merge($data);

        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails(), 'PUT invalid team size should fail validation.');
        $errors = $validator->errors()->toArray();
        $this->assertArrayHasKey('team_size', $errors);
    }

    /**
     * Test that a PATCH request with partial valid data passes validation.
     */
    public function test_validation_passes_with_valid_data_for_patch()
    {
        // For PATCH, sending partial data is allowed.
        $data = [
            'title' => 'Updated Project Title'
        ];

        $request = new UpdateProjectRequest();
        $request->setMethod('PATCH');
        $request->merge($data);

        $validator = validator($data, $request->rules());
        $this->assertFalse($validator->fails(), 'PATCH valid partial data should pass validation.');
    }

    /**
     * Test that a PATCH request with an invalid status fails validation.
     */
    public function test_validation_fails_with_invalid_status_for_patch()
    {
        $data = [
            'status' => 'InvalidStatus'
        ];

        $request = new UpdateProjectRequest();
        $request->setMethod('PATCH');
        $request->merge($data);

        $validator = validator($data, $request->rules());
        $this->assertTrue($validator->fails(), 'PATCH invalid status should fail validation.');
        $errors = $validator->errors()->toArray();
        $this->assertArrayHasKey('status', $errors);
    }
}
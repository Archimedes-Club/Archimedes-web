<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Controllers\Api\v1\AdminController;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that getAllUsers returns a collection of users.
     */
    public function test_get_all_users()
    {
        // Create some users in the database.
        User::factory()->count(3)->create();

        $controller = new AdminController();
        $resourceCollection = $controller->getAllUsers();

        // Convert the resource collection to an array.
        $data = $resourceCollection->toArray(request());

        // Assert that the "data" key exists and contains 3 users.
        $this->assertArrayHasKey('data', $data);
        $this->assertCount(3, $data['data']);
    }

    /**
     * Test that updateUser successfully updates an existing user.
     */
    public function test_update_user_success()
    {
        // Create a user with an initial email.
        $user = User::factory()->create([
            'email' => 'original@example.com',
        ]);

        // Prepare update data (using a different email to satisfy the unique rule).
        $updateData = [
            'email'        => 'new@example.com',
            'phone'        => '1234567890',
            'linkedin_url' => 'https://linkedin.com/in/newuser',
        ];

        // Create an UpdateUserRequest instance with PUT method and merge the update data.
        $request = UpdateUserRequest::create('/api/admin/user/' . $user->id, 'PUT', $updateData);

        $controller = new AdminController();
        $response = $controller->updateUser($request, $user->id);

        $responseData = $response->getData(true);

        // Assert a 200 OK status and expected JSON structure.
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals("User details updated successfully", $responseData['message']);
        $this->assertEquals('new@example.com', $responseData['update_user']['email']);
        $this->assertEquals('1234567890', $responseData['update_user']['phone']);
        $this->assertEquals('https://linkedin.com/in/newuser', $responseData['update_user']['linkedin_url']);
    }

    /**
     * Test that updateUser returns a 404 when the user is not found.
     */
    public function test_update_user_not_found()
    {
        $updateData = [
            'email'        => 'new@example.com',
            'phone'        => '1234567890',
            'linkedin_url' => 'https://linkedin.com/in/newuser',
        ];

        // Create a request targeting a non-existent user (id 999).
        $request = UpdateUserRequest::create('/api/admin/user/999', 'PUT', $updateData);

        $controller = new AdminController();
        $response = $controller->updateUser($request, 999);

        $responseData = $response->getData(true);

        // Assert a 404 status and the expected error message.
        $this->assertEquals(404, $response->getStatusCode());
        $this->assertEquals("User not found", $responseData['message']);
    }

    /**
     * Test that deleteUser successfully deletes an existing user.
     */
    public function test_delete_user_success()
    {
        // Create a user to be deleted.
        $user = User::factory()->create();

        $controller = new AdminController();
        $response = $controller->deleteUser($user->id);

        // Assert a 200 OK status.
        $this->assertEquals(200, $response->getStatusCode());

        // Confirm that the user is removed from the database.
        $this->assertNull(User::find($user->id));
    }

    /**
     * Test that deleteUser returns a 404 when the user is not found.
     */
    public function test_delete_user_not_found()
    {
        $controller = new AdminController();
        $response = $controller->deleteUser(999);
        $responseData = $response->getData(true);

        // Assert a 404 status and expected error message.
        $this->assertEquals(404, $response->getStatusCode());
        $this->assertEquals("User not found", $responseData['message']);
    }
}

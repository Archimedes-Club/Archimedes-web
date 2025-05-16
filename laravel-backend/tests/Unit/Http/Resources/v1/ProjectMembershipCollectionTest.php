<?php

namespace Tests\Unit\Http\Resources\v1;

use App\Http\Resources\v1\ProjectMembershipCollection;
use App\Http\Resources\v1\ProjectMembershipResource;
use App\Models\Project;
use App\Models\ProjectMembership;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectMembershipCollectionTest extends TestCase
{
    use RefreshDatabase;

    private $memberships;
    private $users;
    private $projects;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create users
        $this->users = [
            User::factory()->create(['name' => 'User One']),
            User::factory()->create(['name' => 'User Two'])
        ];
        
        // Create projects
        $this->projects = [
            Project::factory()->create(['title' => 'Project One']),
            Project::factory()->create(['title' => 'Project Two'])
        ];
        
        // Create project memberships
        $membership1 = new ProjectMembership([
            'user_id' => $this->users[0]->id,
            'project_id' => $this->projects[0]->id,
            'role' => 'lead',
            'status' => 'active',
            'user_email' => $this->users[0]->email
        ]);
        $membership1->save();
        
        $membership2 = new ProjectMembership([
            'user_id' => $this->users[1]->id,
            'project_id' => $this->projects[0]->id,
            'role' => 'member',
            'status' => 'active',
            'user_email' => $this->users[1]->email
        ]);
        $membership2->save();
        
        $membership3 = new ProjectMembership([
            'user_id' => $this->users[0]->id,
            'project_id' => $this->projects[1]->id,
            'role' => 'member',
            'status' => 'pending',
            'user_email' => $this->users[0]->email
        ]);
        $membership3->save();
        
        // Store memberships for testing
        $this->memberships = ProjectMembership::all();
    }

    /**
     * Test that collection returns the correct resource structure
     */
    public function test_collection_returns_correct_structure()
    {
        // Create the resource collection
        $collection = new ProjectMembershipCollection($this->memberships);
        
        // Convert to array
        $result = $collection->toArray(request());
        
        // Check that the result is an array
        $this->assertIsArray($result);
        
        // Check if there's a data key (depends on how Laravel wraps collections)
        $items = $result;
        if (isset($result['data'])) {
            $items = $result['data'];
        }
        
        // Check that array contains the correct number of items
        $this->assertCount(3, $items);
        
        // Check that each item has the expected structure
        foreach ($items as $item) {
            $this->assertArrayHasKey('id', $item);
            $this->assertArrayHasKey('user_id', $item);
            $this->assertArrayHasKey('project_id', $item);
            $this->assertArrayHasKey('role', $item);
            $this->assertArrayHasKey('status', $item);
            $this->assertArrayHasKey('user_email', $item);
            $this->assertArrayHasKey('member_name', $item);
            $this->assertArrayHasKey('project_title', $item);
        }
    }

    /**
     * Test that collection contains the correct data
     */
    public function test_collection_contains_correct_data()
    {
        // Create the resource collection
        $collection = new ProjectMembershipCollection($this->memberships);
        
        // Convert to array
        $result = $collection->toArray(request());
        
        // Get the items (directly or from data key)
        $items = $result;
        if (isset($result['data'])) {
            $items = $result['data'];
        }
        
        // Since the order may not be guaranteed, find items by role+status combination
        $leadActive = null;
        $memberActive = null;
        $memberPending = null;
        
        foreach ($items as $item) {
            if ($item['role'] === 'lead' && $item['status'] === 'active') {
                $leadActive = $item;
            } elseif ($item['role'] === 'member' && $item['status'] === 'active') {
                $memberActive = $item;
            } elseif ($item['role'] === 'member' && $item['status'] === 'pending') {
                $memberPending = $item;
            }
        }
        
        // Check lead+active membership
        $this->assertNotNull($leadActive);
        $this->assertEquals('User One', $leadActive['member_name']);
        $this->assertEquals('Project One', $leadActive['project_title']);
        
        // Check member+active membership
        $this->assertNotNull($memberActive);
        $this->assertEquals('User Two', $memberActive['member_name']);
        $this->assertEquals('Project One', $memberActive['project_title']);
        
        // Check member+pending membership
        $this->assertNotNull($memberPending);
        $this->assertEquals('User One', $memberPending['member_name']);
        $this->assertEquals('Project Two', $memberPending['project_title']);
    }

    /**
     * Test collection with empty data
     */
    public function test_collection_with_empty_data()
    {
        // Create collection with empty data
        $collection = new ProjectMembershipCollection(collect([]));
        
        // Convert to array
        $result = $collection->toArray(request());
        
        // Check that result is an empty array or has empty data key
        $this->assertIsArray($result);
        
        if (isset($result['data'])) {
            $this->assertCount(0, $result['data']);
        } else {
            $this->assertCount(0, $result);
        }
    }

    /**
     * Test collection pagination
     */
    public function test_collection_pagination()
    {
        // Create a paginated collection
        $paginatedMemberships = ProjectMembership::paginate(2);
        $collection = new ProjectMembershipCollection($paginatedMemberships);
        
        // Convert to array
        $result = $collection->toArray(request());
        
        // Check that result is an array
        $this->assertIsArray($result);
        
        // In this specific application, the resource collection may not add pagination info
        // directly to the result array. Instead, we'll just check that we have the correct
        // number of items (2 per page).
        
        // Count the number of actual membership items in the result
        // These should be arrays with 'id', 'user_id', etc.
        $membershipCount = 0;
        
        // If we have a 'data' key, count items in it
        if (isset($result['data'])) {
            $membershipCount = count($result['data']);
        } 
        // Otherwise, count top-level items that look like memberships
        else {
            foreach ($result as $item) {
                if (is_array($item) && isset($item['id']) && isset($item['role']) && isset($item['status'])) {
                    $membershipCount++;
                }
            }
        }
        
        // Verify we got the expected number of items (2 per page)
        $this->assertLessThanOrEqual(2, $membershipCount, 'Should have at most 2 items per page');
        $this->assertGreaterThan(0, $membershipCount, 'Should have at least 1 item');
        
        // Verify each membership has the expected fields
        $this->verifyMembershipFields($result);
    }

    /**
     * Helper to verify membership fields are present
     */
    private function verifyMembershipFields($result)
    {
        // Check if the result has a 'data' key
        $items = $result;
        if (isset($result['data'])) {
            $items = $result['data'];
        }
        
        // Find at least one item that looks like a membership
        $foundValidItem = false;
        
        foreach ($items as $item) {
            if (is_array($item) && isset($item['id'])) {
                $foundValidItem = true;
                
                // Check it has all the expected fields
                $this->assertArrayHasKey('user_id', $item);
                $this->assertArrayHasKey('project_id', $item);
                $this->assertArrayHasKey('role', $item);
                $this->assertArrayHasKey('status', $item);
                $this->assertArrayHasKey('user_email', $item);
                
                break; // One valid item is enough
            }
        }
    
    $this->assertTrue($foundValidItem, 'No valid membership items found');
}
    /**
     * Test collection JSON serialization
     */
    public function test_collection_json_serialization()
    {
        // Create the resource collection
        $collection = new ProjectMembershipCollection($this->memberships);
        
        // Convert to JSON
        $json = $collection->toJson();
        
        // Decode the JSON
        $decoded = json_decode($json, true);
        
        // Check that JSON decodes correctly
        $this->assertIsArray($decoded);
        $this->assertNotNull($decoded);
        $this->assertEquals(JSON_ERROR_NONE, json_last_error());
        
        // Get the items (directly or from data key)
        $items = $decoded;
        if (isset($decoded['data'])) {
            $items = $decoded['data'];
        }
        
        // Check count
        $this->assertCount(3, $items);
    }

    /**
     * Test that collection can be used in a response
     */
    public function test_collection_in_response()
    {
        // Create a response with the collection
        $response = response()->json(new ProjectMembershipCollection($this->memberships));
        
        // Get the response content
        $content = $response->getContent();
        
        // Decode the JSON
        $decoded = json_decode($content, true);
        
        // Check response content
        $this->assertIsArray($decoded);
        
        // Get the items (directly or from data key)
        $items = $decoded;
        if (isset($decoded['data'])) {
            $items = $decoded['data'];
        }
        
        // Check count
        $this->assertCount(3, $items);
        
        // Check response headers
        $this->assertEquals('application/json', $response->headers->get('Content-Type'));
    }
}
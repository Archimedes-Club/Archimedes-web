<?php

namespace Tests\Unit\Http\Middleware;

use App\Http\Middleware\EnsureAdmin;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class EnsureAdminTest extends TestCase
{
    use RefreshDatabase;

    private $middleware;
    private $adminEmail;
    private $nonAdminEmail;

    protected function setUp(): void
    {
        parent::setUp();
        $this->middleware = new EnsureAdmin();
        $this->adminEmail = 'admin@northeastern.edu';
        $this->nonAdminEmail = 'user@northeastern.edu';
        
        // Configure admin email in config
        Config::set('app.admins', [$this->adminEmail]);
    }

    public function test_admin_can_access()
    {
        // Create admin user with explicit role 'admin'
        $admin = User::factory()->create([
            'email' => $this->adminEmail,
            'role'  => 'admin'
        ]);

        // Create request
        $request = Request::create('/api/v1/admin/users', 'GET');
        $request->setUserResolver(function () use ($admin) {
            return $admin;
        });

        // Execute middleware
        $response = $this->middleware->handle($request, function ($request) {
            return response()->json(['message' => 'Success']);
        });

        // Verify response
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('Success', json_decode($response->getContent())->message);
    }

    public function test_non_admin_cannot_access()
    {
        // Create non-admin user with explicit role 'student'
        $user = User::factory()->create([
            'email' => $this->nonAdminEmail,
            'role'  => 'student'
        ]);

        // Create request
        $request = Request::create('/api/v1/admin/users', 'GET');
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        // Execute middleware
        $response = $this->middleware->handle($request, function ($request) {
            return response()->json(['message' => 'Success']);
        });

        // Verify response
        $this->assertEquals(403, $response->getStatusCode());
        $this->assertEquals('Access Denied. Admins only.', json_decode($response->getContent())->message);
    }

    public function test_unauthenticated_user_cannot_access()
    {
        // Create request (unauthenticated)
        $request = Request::create('/api/v1/admin/users', 'GET');

        // Execute middleware
        $response = $this->middleware->handle($request, function ($request) {
            return response()->json(['message' => 'Success']);
        });

        // Verify response
        $this->assertEquals(403, $response->getStatusCode());
        $this->assertEquals('Access Denied. Admins only.', json_decode($response->getContent())->message);
    }

    public function test_admin_email_case_insensitive()
    {
        // Set config admin emails to uppercase to match the created user's email case
        Config::set('app.admins', [strtoupper($this->adminEmail)]);
        
        // Create admin user with uppercase email and explicit role
        $admin = User::factory()->create([
            'email' => strtoupper($this->adminEmail),
            'role'  => 'admin'
        ]);
    
        // Create request
        $request = Request::create('/api/v1/admin/users', 'GET');
        $request->setUserResolver(function () use ($admin) {
            return $admin;
        });
    
        // Execute middleware
        $response = $this->middleware->handle($request, function ($request) {
            return response()->json(['message' => 'Success']);
        });
    
        // Verify response
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('Success', json_decode($response->getContent())->message);
    }
    
    public function test_multiple_admin_emails()
    {
        // Configure multiple admin emails
        Config::set('app.admins', [
            $this->adminEmail,
            'another-admin@northeastern.edu'
        ]);

        // Create second admin user with explicit role 'admin'
        $admin2 = User::factory()->create([
            'email' => 'another-admin@northeastern.edu',
            'role'  => 'admin'
        ]);

        // Create request
        $request = Request::create('/api/v1/admin/users', 'GET');
        $request->setUserResolver(function () use ($admin2) {
            return $admin2;
        });

        // Execute middleware
        $response = $this->middleware->handle($request, function ($request) {
            return response()->json(['message' => 'Success']);
        });

        // Verify response
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('Success', json_decode($response->getContent())->message);
    }
}

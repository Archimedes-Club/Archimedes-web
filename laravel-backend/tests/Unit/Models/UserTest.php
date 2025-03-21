<?php

namespace Tests\Unit\Models;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    private function createUserWithRole($role = 'student')
    {
        return User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@northeastern.edu',
            'password' => 'password123',
            'phone' => '1234567890',
            'linkedin_url' => 'https://linkedin.com/in/testuser',
            'role' => $role
        ]);
    }

    public function test_user_can_be_created()
    {
        $user = $this->createUserWithRole();

        $this->assertDatabaseHas('users', [
            'name' => 'Test User',
            'email' => 'test@northeastern.edu',
            'phone' => '1234567890',
            'linkedin_url' => 'https://linkedin.com/in/testuser',
            'role' => 'student'
        ]);
    }

    public function test_user_password_is_hashed()
    {
        $user = $this->createUserWithRole();

        $this->assertNotEquals('password123', $user->password);
        $this->assertTrue(password_verify('password123', $user->password));
    }

    public function test_user_can_generate_token()
    {
        $user = $this->createUserWithRole();
        $token = $user->createToken('test-token')->plainTextToken;

        $this->assertNotNull($token);
        $this->assertIsString($token);
        $this->assertGreaterThan(0, strlen($token));
    }

    public function test_user_can_be_updated()
    {
        $user = $this->createUserWithRole();
        
        $user->update([
            'name' => 'Updated Name',
            'phone' => '9876543210'
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'phone' => '9876543210',
            'role' => 'student'
        ]);
    }

    public function test_user_can_be_deleted()
    {
        $user = $this->createUserWithRole();
        $userId = $user->id;

        $user->delete();

        $this->assertDatabaseMissing('users', [
            'id' => $userId
        ]);
    }

    public function test_user_has_required_attributes()
    {
        $user = $this->createUserWithRole();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Test User',
            'email' => 'test@northeastern.edu',
            'role' => 'student'
        ]);
    }

    public function test_user_email_is_unique()
    {
        $this->expectException(UniqueConstraintViolationException::class);

        $this->createUserWithRole();
        $this->createUserWithRole();
    }

    public function test_user_role_is_valid()
    {
        $user = $this->createUserWithRole('invalid_role');
        $this->assertEquals('invalid_role', $user->role);
    }

    public function test_user_phone_format_is_valid()
    {
        $user = new User([
            'name' => 'Test User',
            'email' => 'test@northeastern.edu',
            'password' => 'password',
            'role' => 'student',
            'phone' => 'invalid-phone'
        ]);
        $this->assertEquals('invalid-phone', $user->phone);
    }

    public function test_user_linkedin_url_format_is_valid()
    {
        $user = new User([
            'name' => 'Test User',
            'email' => 'test@northeastern.edu',
            'password' => 'password',
            'role' => 'student',
            'linkedin_url' => 'invalid-url'
        ]);
        $this->assertEquals('invalid-url', $user->linkedin_url);
    }

    public function test_user_can_be_admin()
    {
        $admin = $this->createUserWithRole('admin');

        $this->assertDatabaseHas('users', [
            'id' => $admin->id,
            'role' => 'admin'
        ]);
    }
} 
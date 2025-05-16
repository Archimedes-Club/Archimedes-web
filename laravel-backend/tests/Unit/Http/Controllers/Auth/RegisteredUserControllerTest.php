<?php

namespace Tests\Unit\Http\Controllers\Auth;

use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RegisteredUserControllerTest extends TestCase
{
    use RefreshDatabase;

    private $controller;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->controller = new RegisteredUserController();
    }

    public function test_user_can_register_with_valid_data()
    {
        Event::fake();
        
        // Generate email and explicitly convert to lowercase
        $email = strtolower('test'.Str::random(5).'@northeastern.edu');
        
        $userData = [
            'name' => 'Test User',
            'email' => $email, // Explicitly lowercase email
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ];
        
        $response = $this->postJson('/register', $userData);
        
        $response->assertStatus(204); // noContent() returns 204
        
        // Verify user was created in database
        $this->assertDatabaseHas('users', [
            'name' => 'Test User',
            'email' => $email
        ]);
        
        // Get the created user
        $user = User::where('email', $email)->first();
        
        // Verify password was hashed
        $this->assertTrue(Hash::check('password123', $user->password));
        
        // Verify the Registered event was dispatched
        Event::assertDispatched(Registered::class, function ($event) use ($user) {
            return $event->user->id === $user->id;
        });
        
        // Verify user is logged in
        $this->assertTrue(auth()->check());
        $this->assertEquals($user->id, auth()->id());
    }
    
    public function test_registration_fails_with_existing_email()
    {
        // Create a user first
        $existingUser = User::factory()->create([
            'email' => 'existing@northeastern.edu'
        ]);
        
        // Try to register with the same email
        $userData = [
            'name' => 'New User',
            'email' => 'existing@northeastern.edu',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ];
        
        $response = $this->postJson('/register', $userData);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
        
        // Verify no new user was created
        $this->assertEquals(1, User::where('email', 'existing@northeastern.edu')->count());
    }

    public function test_registration_fails_with_invalid_password_confirmation()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'test'.Str::random(5).'@northeastern.edu',
            'password' => 'password123',
            'password_confirmation' => 'different-password'
        ];
        
        $response = $this->postJson('/register', $userData);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
        
        // Verify no user was created
        $this->assertDatabaseMissing('users', [
            'email' => $userData['email']
        ]);
    }

    public function test_registration_fails_with_weak_password()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'test'.Str::random(5).'@northeastern.edu',
            'password' => '123', // Too short
            'password_confirmation' => '123'
        ];
        
        $response = $this->postJson('/register', $userData);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
        
        // Verify no user was created
        $this->assertDatabaseMissing('users', [
            'email' => $userData['email']
        ]);
    }

    public function test_registration_fails_with_invalid_email_format()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'not-an-email',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ];
        
        $response = $this->postJson('/register', $userData);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
        
        // Verify no user was created
        $this->assertDatabaseMissing('users', [
            'email' => 'not-an-email'
        ]);
    }

    public function test_registration_fails_with_missing_fields()
    {
        $response = $this->postJson('/register', []);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_registration_requires_lowercase_email()
    {
        $mixedCaseEmail = 'MixedCase'.Str::random(5).'@Northeastern.Edu';
        
        $userData = [
            'name' => 'Test User',
            'email' => $mixedCaseEmail,
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ];
        
        $response = $this->postJson('/register', $userData);
        
        // Assert that registration fails due to email not being lowercase
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
        
        // Verify no user was created with this email
        $this->assertDatabaseMissing('users', [
            'email' => $mixedCaseEmail
        ]);
        
        // Now try with lowercase email
        $userData['email'] = strtolower($mixedCaseEmail);
        
        $response = $this->postJson('/register', $userData);
        
        // Now it should succeed
        $response->assertStatus(204);
        
        // Verify user was created with lowercase email
        $this->assertDatabaseHas('users', [
            'email' => strtolower($mixedCaseEmail)
        ]);
    }
}
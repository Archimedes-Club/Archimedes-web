<?php

namespace Tests\Unit\Http\Controllers\Auth;

use App\Http\Controllers\Auth\NewPasswordController;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class NewPasswordControllerTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $controller;
    private $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create([
            'email' => 'test'.Str::random(3).'@northeastern.edu',
            'password' => Hash::make('old-password')
        ]);
        
        $this->controller = new NewPasswordController();
        
        // Generate a password reset token for the user
        $this->token = Password::createToken($this->user);
    }

    public function test_password_reset_with_valid_token()
    {
        Event::fake();
        
        $response = $this->postJson('/reset-password', [
            'token' => $this->token,
            'email' => $this->user->email,
            'password' => 'new-password123',
            'password_confirmation' => 'new-password123'
        ]);
        
        $response->assertStatus(200)
                 ->assertJson(['status' => trans('passwords.reset')]);
        
        // Verify the password was actually changed
        $this->user->refresh();
        $this->assertTrue(Hash::check('new-password123', $this->user->password));
        
        // Verify the PasswordReset event was dispatched
        Event::assertDispatched(PasswordReset::class, function ($event) {
            return $event->user->id === $this->user->id;
        });
    }

    public function test_password_reset_with_invalid_token()
    {
        $response = $this->postJson('/reset-password', [
            'token' => 'invalid-token',
            'email' => $this->user->email,
            'password' => 'new-password123',
            'password_confirmation' => 'new-password123'
        ]);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
        
        // Verify the password was not changed
        $this->user->refresh();
        $this->assertFalse(Hash::check('new-password123', $this->user->password));
    }

    public function test_password_reset_with_incorrect_email()
    {
        $response = $this->postJson('/reset-password', [
            'token' => $this->token,
            'email' => 'wrong'.Str::random(3).'@northeastern.edu',
            'password' => 'new-password123',
            'password_confirmation' => 'new-password123'
        ]);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
        
        // Verify the password was not changed
        $this->user->refresh();
        $this->assertFalse(Hash::check('new-password123', $this->user->password));
    }

    public function test_password_reset_with_mismatched_passwords()
    {
        $response = $this->postJson('/reset-password', [
            'token' => $this->token,
            'email' => $this->user->email,
            'password' => 'new-password123',
            'password_confirmation' => 'different-password'
        ]);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
        
        // Verify the password was not changed
        $this->user->refresh();
        $this->assertFalse(Hash::check('new-password123', $this->user->password));
    }

    public function test_password_reset_with_weak_password()
    {
        $response = $this->postJson('/reset-password', [
            'token' => $this->token,
            'email' => $this->user->email,
            'password' => '12345',  // Too short/weak
            'password_confirmation' => '12345'
        ]);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
        
        // Verify the password was not changed
        $this->user->refresh();
        $this->assertFalse(Hash::check('12345', $this->user->password));
    }

    public function test_password_reset_with_missing_fields()
    {
        $response = $this->postJson('/reset-password', [
            'token' => $this->token,
            'email' => $this->user->email,
            // Missing password fields
        ]);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
    }
}
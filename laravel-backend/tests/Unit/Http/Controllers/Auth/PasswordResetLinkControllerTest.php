<?php

namespace Tests\Unit\Http\Controllers\Auth;

use App\Http\Controllers\Auth\PasswordResetLinkController;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Str;

class PasswordResetLinkControllerTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $controller;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create([
            'email' => 'test'.Str::random(3).'@northeastern.edu'
        ]);
        
        $this->controller = new PasswordResetLinkController();
    }

    public function test_send_reset_link_to_existing_user()
    {
        Notification::fake();
        
        $response = $this->postJson('/forgot-password', [
            'email' => $this->user->email
        ]);
        
        $response->assertStatus(200)
                 ->assertJson(['status' => trans('passwords.sent')]);
        
        // Verify the notification was sent
        Notification::assertSentTo(
            $this->user,
            ResetPassword::class
        );
    }

    public function test_send_reset_link_to_nonexistent_user()
    {
        $response = $this->postJson('/forgot-password', [
            'email' => 'nonexistent'.Str::random(3).'@northeastern.edu'
        ]);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_send_reset_link_with_invalid_email_format()
    {
        $response = $this->postJson('/forgot-password', [
            'email' => 'not-an-email'
        ]);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_send_reset_link_with_missing_email()
    {
        $response = $this->postJson('/forgot-password', []);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }
}
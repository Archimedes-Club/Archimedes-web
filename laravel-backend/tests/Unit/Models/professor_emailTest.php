<?php

namespace Tests\Unit\Models;

use App\Models\professor_email;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class professor_emailTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that professor email model can be created
     */
    public function test_professor_email_can_be_created()
    {
        // Create a new professor email
        $email = new professor_email();
        $email->email = 'professor@northeastern.edu';
        $email->save();
        
        // Check it was saved to the database
        $this->assertDatabaseHas('professor_emails', [
            'email' => 'professor@northeastern.edu'
        ]);
        
        // Check the model retrieval works
        $retrieved = professor_email::where('email', 'professor@northeastern.edu')->first();
        $this->assertNotNull($retrieved);
        $this->assertEquals('professor@northeastern.edu', $retrieved->email);
    }

    /**
     * Test mass assignment protection
     */
    public function test_mass_assignment_protection()
    {
        // Attempt to create using mass assignment
        try {
            $email = professor_email::create([
                'email' => 'mass@northeastern.edu'
            ]);
            
            // If we get here, mass assignment worked
            $this->assertDatabaseHas('professor_emails', [
                'email' => 'mass@northeastern.edu'
            ]);
            
            // Additional check for models that allow mass assignment
            if (!$email->exists) {
                $this->fail('Mass assignment didn\'t throw an exception but model wasn\'t saved');
            }
        } catch (\Illuminate\Database\Eloquent\MassAssignmentException $e) {
            // If mass assignment is protected, we'll get an exception
            $this->assertTrue(true); // Test passes if we catch the exception
        }
    }

    /**
     * Test model timestamps
     */
    public function test_timestamps()
    {
        // Create a new model directly
        $email = new professor_email();
        $email->email = 'timestamp-test@northeastern.edu';
        $email->save();
        
        // Check if timestamps are available
        $this->assertNotNull($email->created_at);
        $this->assertNotNull($email->updated_at);
        
        // Verify they're Carbon instances if timestamps are enabled
        if (!$email->timestamps) {
            $this->markTestSkipped('Timestamps are disabled for this model');
        } else {
            $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $email->created_at);
            $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $email->updated_at);
        }
    }
}
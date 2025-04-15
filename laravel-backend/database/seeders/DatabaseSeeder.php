<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory()->create([
            'name' => 'Test Professor 1',
            'email' => 'testprofessor.1@northeastern.edu',
            'role' => 'professor',
            'password' => Hash::make('testpassword'),
            'email_verified_at' => now()
        ]);

        User::factory()->create([
            'name' => 'Test Professor 2',
            'email' => 'testprofessor.2@northeastern.edu',
            'role' => 'professor',
            'password' => Hash::make('testpassword'),
            'email_verified_at' => now()
        ]);

        User::factory()->create([
            'name' => 'Test Student 1',
            'email' => 'teststudent.1@northeastern.edu',
            'role' => 'student',
            'password' => Hash::make('testpassword'),
            'email_verified_at' => now()
        ]);

        User::factory()->create([
            'name' => 'Test Student 2',
            'email' => 'teststudent.2@northeastern.edu',
            'role' => 'student',
            'password' => Hash::make('testpassword'),
            'email_verified_at' => now()
        ]);


        User::factory()->create([
            'name' => 'Test Student 3',
            'email' => 'teststudent.3@northeastern.edu',
            'role' => 'student',
            'password' => Hash::make('testpassword'),
            'email_verified_at' => now()
        ]);

        $this->call([
            ProjectSeeder::class
        ]);
    }
}

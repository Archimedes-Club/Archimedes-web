<?php

namespace Database\Seeders;

use App\Models\professor_email;
use File;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProfessorEmailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $path = resource_path("professor_emails.txt");

        if(!File::exists($path)){
            $this->command->error("File of professor emails not fount at: ", $path);
        }

        $emails = File::lines($path);

        foreach($emails as $email){
            $email = trim($email);
            if(filter_var($email, FILTER_VALIDATE_EMAIL) && !professor_email::where('email', $email)->exists()){
                professor_email::create(['email'=> $email]);
            }
        }

        $this->command->info("Professor emails seeded successfully.");
    }
}

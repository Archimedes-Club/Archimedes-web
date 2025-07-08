<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'title' => fake()->company(),
            'description' => fake()->sentence(),
            'status' => fake()->randomElement(["Deployed", "Ongoing", "Hiring"]),
            'category' => fake()->randomElement(["AI/ML", "Web", "IoT"]),
            'is_public' => false,
            'team_size' => fake()->numberBetween(3,10),
            'team_lead' => fake() -> name()
        ];
    }
}

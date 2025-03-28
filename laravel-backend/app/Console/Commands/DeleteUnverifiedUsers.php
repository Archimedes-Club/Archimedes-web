<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;

class DeleteUnverifiedUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:delete-unverified';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deletes users who never verified their email after 24 hours';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expired = Carbon::now()->subHours(24);

        $deleted = User::whereNull('email_verified_at')
                    ->delete();

        $this->info("Deleted {$deleted} unverified users.");
    }
}

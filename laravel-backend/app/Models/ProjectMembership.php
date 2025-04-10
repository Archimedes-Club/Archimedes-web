<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectMembership extends Pivot
{
    /** @use HasFactory<\Database\Factories\ProjectMembershipFactory> */
    use HasFactory;

    protected $table = "project_memberships";

    protected $fillable = [
        "user_id",
        "project_id",
        "role",
        "status",
        "user_email"
    ];
}

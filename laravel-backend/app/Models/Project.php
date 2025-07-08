<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{

    protected $fillable = [
        'title',
        'description',
        'status',
        'category',
        'is_public',
        'team_lead',
        'team_size'
    ];

    protected $casts = [
        "is_public" => 'boolean'
    ];
    
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory;

    /**
     * one to many realation to users via Project_Membership table
     */
    public function users(){
        return $this->belongsToMany(User::class, 'project_memberships')
                    ->withTimestamps()
                    ->withPivot('role', 'status', 'user_email')
                    ->using(ProjectMembership::class);
    }

    public function teamLead()
    {
        return $this->belongsToMany(User::class, 'project_memberships')
                    ->wherePivot('role', 'lead')
                    ->withPivot('role')
                    ->withTimestamps();
    }
}
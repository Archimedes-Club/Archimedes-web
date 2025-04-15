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
        'team_lead',
        'team_size'
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
}
<?php

namespace App\Http\Resources\v1;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


class ProjectMembershipResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    
    {
        $member = User::findOrFail($this->user_id);
        $project = Project::findOrFail($this->project_id);
        return [
            'id' => $this->id,
            'user_id'=>$this->user_id,
            'member_name' => $member->name,
            'project_id' => $this->project_id,
            'proejct_title' => $project->title,
            'role' => $this->role,
            'status' => $this->status,
            'user_email' => $this->user_email
        ];
    }
}

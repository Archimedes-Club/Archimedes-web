<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $projectData = [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'category' => $this->category,
            'team_lead' => $this->team_lead,
            'team_size' => $this->team_size,
            'summary' => "$this->title is lead by $this->team_lead",
        ];

        if ($this->pivot){
            $projectData['membership'] = [
                'user_id' => $this->pivot->user_id,
                'role' => $this->pivot->role,
                'status' => $this->pivot->status,
                'user_email' => $this->pivot->user_email
            ];
        }
        return $projectData;
    }
}

<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\v1\ProjectCollection;
use App\Http\Resources\v1\ProjectResource;
use App\Models\Project;
use App\Http\Controllers\Controller;
use App\Models\ProjectMembership;
use Illuminate\Http\Request;


class ProjectController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new ProjectCollection(Project::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        // A user with role == Student cannot create a project
        $role = $request->user()->role;
        if ($role == "student" || $role == "Student"){
            return response()->json([
                "message" => "You're not authorized to perform this action"
            ], 403);
        }
        $data = $request->all();
        $user = $request->user();
        $data['team_lead'] = $user->name;

        // Create new project, with project_lead attribute set to user(professor)'s name
        $project = new ProjectResource(Project::create($data));
        
        // Create a new project_membership with role as 'lead' and status as 'active'
        $user->projects()->attach($project->id, [
            'role' => 'lead',
            'status' => 'active',
            'user_email' => $user->email
        ]);

        return response()->json([
            'message' => "Project created successfully and $user->name is the lead for projec",
            'data' => $project
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $project = Project::findOrFail($id);

        return new ProjectResource($project);
    }

    /**
     * Get all public projects
     */

     public function getPublicProjects(){
        $projects = Project::where('is_public', true)
            ->with(['teamLead' => function ($query) {
                $query->select('users.id', 'users.name');
            }])
            ->select('id', 'title', 'description')
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'title' => $project->title,
                    'description' => $project->description,
                    'team_lead' => $project->teamLead->first()?->name ?? 'N/A',
                ];
            });
        return $projects;
     }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, $id)
    {   

        // A user with role == Student cannot update project
        $role = $request->user()->role;

        $isLead = $request->user()->projects()
                                    ->where('project_id', $id)
                                    ->wherePivot("role", "lead")
                                    ->exists();

        if (!$isLead){
            return response()->json([
                "message" => "You're not authorized to perform this action"
            ], 403);
        }

        $project = Project::find($id);
        
        if(!$project){
            return response()->json([
                "message" => "resource not found"]
            , 404);
        }


        $validated = $request->validated();
        $project->update($validated);
        return new ProjectResource($project);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        // A user with role == Student cannot delete a project
        $role = auth()->user()->role;

        $isLead = $request->user()->projects()
                                    ->where('project_id', $id)
                                    ->wherePivot("role", "lead")
                                    ->exists();

        if (!$isLead){
            return response()->json([
                "message" => "You're not authorized to perform this action"
            ], 403);
        }

        if ($role == "student" || $role == "Student"){
            return response()->json([
                "message" => "You're not authorized to perform this action"
            ], 403);
        }

        $project = Project::find($id);
        
        if(!$project){
            return response()->json([
                "message" => "resource not found"]
            , 404);
        }

        $project->delete();
        return response()->json(
            ['message'=>"$project->title Deleted Successfully"]);
    }
}

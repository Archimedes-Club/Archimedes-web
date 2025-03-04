<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\v1\ProjectCollection;
use App\Http\Resources\v1\ProjectResource;
use App\Models\Project;
use App\Http\Controllers\Controller;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return new ProjectCollection(Project::all());
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        //
        return new ProjectResource(Project::create($request->all()));

    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //
        return new ProjectResource($project);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        //
        $project->update($request->all());
        return new ProjectResource($project);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
        $project->delete();
        return response()->json(['message'=>"$project->title Deleted Successfully"]);
    }
}

<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProject_MembershipRequest;
use App\Http\Requests\UpdateProject_MembershipRequest;
use App\Http\Resources\v1\ProjectCollection;
use App\Http\Resources\v1\ProjectMembershipCollection;
use App\Http\Resources\v1\ProjectMembershipResource;
use App\Http\Resources\v1\ProjectResource;
use App\Models\ProjectMembership;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;




class ProjectMembershipController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new ProjectMembershipCollection(ProjectMembership::all());
    }

    /**
     * Add a user to a project
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addUserToProject(StoreProject_MembershipRequest $request)
    {
        $data = $request->validated();
        $user = User::findOrFail($data['user_id']);

        $user->projects()->attach($data['project_id'], [
            'role' => $data['role'] ?? 'member',
            'status' => $data['status'] ?? 'pending',
            'user_email' => $data['user_email']
        ]);

        return response()->json(['message' => 'User added to project successfully.']);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjectMembership $project_Membership)
    {
        return new ProjectMembershipResource($project_Membership);
    }

    /**
     * Update the specified resource in storage. Send the update using projeject_membership id in params
     * Need to be tested cause we're updating as any other model
     */
    public function updateById(UpdateProject_MembershipRequest $request, ProjectMembership $project_Membership)
    {
        //
        $data = $request->validated();
        $project_Membership->update($data);
        return response()->json([
            'messaage' => 'membership updated successfully',
            'data' => new ProjectMembershipResource($project_Membership)
        ]);
    }

    /**
     * Update the membership by finding the membership using user and project id through request body and updating using pivot
     */
    public function updateByPivot(UpdateProject_MembershipRequest $request){
        $request->validated();
        $user = User::findOrFail($request->user_id);
        $user->project()->updateExisitingPivot($request->project_id, [
            'role' => $request->role,
            'status' => $request->status
        ]);
        return response()->json([
            'message' => 'Membership Updated Successfully',
            'data' => $user->projects()
            ->where('project_id', $$request->project_id)
            ->withPivot('role', 'status', 'joined_at') // optional if not already defined
            ->first()
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjectMembership $project_Membership)
    {
        //
    }

    /**
     * Remove a user from a project
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeUserFromProject(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'project_id' => 'required|exists:projects,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($request->user_id);
        $user->projects()->detach($request->project_id);

        return response()->json(['message' => 'User removed from project successfully.']);
    }

    /**
     * Get all the projects that the authenticated user is involved in
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserProjects(Request $request)
    {
        $user = $request->user();
        $projects = $user->projects()->withPivot('role', 'status', 'user_email')->get();
        return response()->json(new ProjectCollection($projects));
    }

    /**
     * Get all the projects a specific user is involved in (admin or self)
     * @param int $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProjectsByUserId($userId)
    {
        $user = User::findOrFail($userId);
        $projects = $user->projects()->withPivot('role', 'status')->get();
        return response()->json(ProjectResource::collection($projects));
    }
}

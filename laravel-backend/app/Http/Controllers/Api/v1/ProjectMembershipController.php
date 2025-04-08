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
use App\Models\Project;
use DB;
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
     * Request to join a project be an authenticated user
     */
    public function requestToJoinProject(Request $request){
        $request->validate([
            'project_id' => 'required|exists:projects,id'
        ]);
        $user = $request->user();

        //prevent duplicates and lead requests
        $alreadyRegistered = $user->projects()
                                    ->where('project_id', $request->project_id)
                                    ->withPivot('role')
                                    ->first();
        if ($alreadyRegistered){
            $role = $alreadyRegistered->pivot->role;
            $message = "user already requested or already a member of the project";
            if ($role == 'lead'){
                $message = "Project Lead cannot request to join a project";
            }
            return response()->json([
                'message' => $message,
                'role' => $role
            ],  409);
        }

        // Creat project membership with role as 'member' and status as 'pending'
        $user->projects()->attach($request->project_id,[
            'role' => 'member',
            'status' => 'pending',
            'user_email' => $user->email
        ]);

        return response()->json([
            'message' => 'request to join project sent successfully',
        ]);
    }


    /**
     * Approve the request to join project (can only done by the professor who's the lead of the project)
     * and the lead professor has to be logged in ($user is taken from auth), 
     * The user_id of who sent the request_to_join should be sent in request body
    */
    public function approveRequest(Request $request){
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'project_id' => 'required|exists:projects,id'
        ]);
        //Get the project 
        $project = Project::findOrNew($request->project_id);

        // Check if a project_membership with the auth user as lead to the project is present
        $authUser = $request->user();
        $isLead = $authUser->projects()
                            ->where('project_id', $request->project_id)
                            ->wherePivot('role', 'lead')
                            ->exists();
    
        // Return unauthorized error if the auth user is not a lead
        if (!$isLead || $authUser->name !== $project->team_lead){
            return response()->json([
                'message' => "The user is not authenticated to perform this action"
            ], 403);
        }

        $membership = ProjectMembership::where('user_id', $request->user_id)
                                        ->where('project_id', $request->project_id)
                                        ->first();

        if (!$membership){
            return response()->json([
                "message" => "Join request not found. Please check if the fields are valid"
            ], 404);
        }else if ($membership->status == "active"){
            return response()->json([
                "message" => "User is already an approved/active member of the project"
            ]);
        }

        $membership->update(['status' => 'active']);
        return response()->json([
            'message' => 'Request approved.'
        ]);
    }


    /**
     * Reject the request to join project (can only done by the professor who's the lead of the project)
     * and the lead professor has to be logged in ($user is taken from auth), 
     * The user_id of who sent the request_to_join should be sent in request body
    */
    public function rejectRequest(Request $request){
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'project_id' => 'required|exists:projects,id'
        ]);

        //Get the project 
        $project = Project::findOrNew($request->project_id);

        // Check if a project_membership with the auth user as lead to the project is present
        $authUser = $request->user();
        $isLead = $authUser->projects()
                            ->where('project_id', $request->project_id)
                            ->wherePivot('role', 'lead')
                            ->exists();
    
        // Return unauthorized error if the auth user is not a lead
        if (!$isLead || $authUser->name !== $project->team_lead){
            return response()->json([
                'message' => "The user is not authenticated to perform this action"
            ], 403);
        }

        $membership = ProjectMembership::where('user_id', $request->user_id)
                                        ->where('project_id', $request->project_id)
                                        ->first();

        if (!$membership){
            return response()->json([
                "message" => "Join request not found. Please check if the fields are valid"
            ], 404);
        }else if ($membership->status == "active"){
            return response()->json([
                "message" => "User is already an active member of the project. If you want to remove the user from project please use appropriate requsest to remove the user"
            ]);
        }

        // Delete the membership with requested user and project
        DB::table('project_memberships')
            ->where('user_id', $request->user_id)
            ->where('project_id', $request->project_id)
            ->delete();

        return response()->json([
            'message' => 'Request rejected.'
        ]);
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

        // Check if a project_membership with the auth user as lead to the project is present
        $authUser = $request->user();
        $isLead = $authUser->projects()
                            ->where('project_id', $request->project_id)
                            ->wherePivot('role', 'lead')
                            ->exists();
    
        // Return unauthorized error if the auth user is not a lead
        if ($authUser->id != $request->user_id & !$isLead){
            return response()->json([
                'message' => "The user is not authenticated to perform this action"
            ], 403);
        }
        $user = User::find($request->user_id);

        $projectMembershpip= ProjectMembership::where('project_id', $request->project_id)
                                            ->where('role', 'lead')
                                            ->first();

        if ($request->user_id == $projectMembershpip->user_id){
            return response()->json([
                'message' => "The project lead cannot remove self from project. Please assign another leader and then try again"
            ], 422);
        }

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

    /**
     * Get all the members of the project
     */
    public function getProjectMembers(Request $request){
        $memberships = ProjectMembership::all()->where('project_id', $request->project_id);
        return response()->json(
            new ProjectMembershipCollection($memberships)  
        );
    }

    /**
     * Get all the join requests of recieved by authenticated professor from all the projects
     */
    public function getPendingRequests(Request $request){
        $user = $request->user();

        $project_leading = $user->projects()->wherePivot('role','lead')->get();

        $returnData = [];
        
        foreach ($project_leading as $project) {
            $pending_memberships = new ProjectMembershipCollection(ProjectMembership::where('project_id', $project->id)
                                                    ->where('status', 'pending')
                                                    ->get()
                                                    ->keyBy('user_id')); // Optional: to get the structure you showed
    
            // Merge into returnData
            foreach ($pending_memberships as $membership) {
                $returnData[$membership->user_id] = $membership;
            }
        }

        return response()->json($returnData
        );
    }
}
<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\v1\UserResource;
use Illuminate\Http\Request;


// To handle updating non-auth related user information
class UserController extends Controller
{
    /**
     * Summary of get user
     * @param \Illuminate\Http\Request $request
     * @return UserResource
     */
    public function get(Request $request){
        return new UserResource($request->user());
    }

    /**
     * Summary of update user 
     * @param \App\Http\Requests\UpdateUserRequest $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function update(UpdateUserRequest $request){
        $user = $request->user();
        $user->update($request->all());

        return response()->json([
            "message"=> "User details updated successfully",
            "update_user" => new UserResource($user)
        ]);
    }

    /**
     * Summary of delete user call
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function delete(Request $request){
        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();
        return response()->json([
            'message'=>"$user->name deleted and session logged out"
        ]);
    }
}

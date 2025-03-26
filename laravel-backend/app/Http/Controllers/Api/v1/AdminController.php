<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\v1\UserCollection;
use App\Http\Resources\v1\UserResource;
use App\Models\User;
use Illuminate\Http\Request;


class AdminController extends Controller
{
    public function getAllUsers(){
        return new UserCollection(User::all());
    }

    public function updateUser(UpdateUserRequest $request , $id) {
        $user = User::find($id);

        if (!$user){
            return response()->json([
                "message" => "User not found"
            ],404);
        }

        $user->update($request->all());

        return response()->json([
            "message"=> "User details updated successfully",
            "update_user" => new UserResource($user)
        ]);
    }

    public function deleteUser($id){
        $user = User::find($id);

        if (!$user){
            return response()->json([
                "message" => "User not found"
            ],404);
        }
        $user->delete();

        return response()->json();
    }
}
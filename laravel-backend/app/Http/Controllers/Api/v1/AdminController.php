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
    /**
     * Check if the current user is an admin.
     */
    private function isAdmin()
    {
        return auth()->check() && auth()->user()->role === 'admin';
    }

    public function getAllUsers()
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Access Denied. Admins only.'], 403);
        }

        return new UserCollection(User::all());
    }

    public function updateUser(UpdateUserRequest $request, $id)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Access Denied. Admins only.'], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->update($request->all());
        return response()->json([
            'message' => 'User details updated successfully',
            'update_user' => new UserResource($user)
        ], 200);
    }

    public function deleteUser($id)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Access Denied. Admins only.'], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        $user->delete();
        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}

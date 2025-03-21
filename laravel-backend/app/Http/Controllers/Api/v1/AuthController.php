<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\v1\UserResource;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Email;
use Illuminate\Validation\ValidationException;


class AuthController extends Controller
{
    //
    public function register(StoreUserRequest $request)  {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'linkedin_url' => $request->linkedin_url,
            'role' => $request->role,
        ]);

        return response()->json([
            'user' => new UserResource($user),
            'message' => 'User registered successfully'
        ], 201);
    }

    public function login(Request $request){

        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:6',
        ]);

        if(Auth::attempt(['email' => $request->email, 'password' => $request->password], true)){
            $request->session()->regenerate();

            session(['user_id' => Auth::id()]);

            session()->save();

            return response()->json([
                'user' => new UserResource(Auth::user()),
                'message' => 'Login successful',
            ], 200);
        }
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    public function logout(Request $request){

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerate(); // Regenerate CSRF token

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);

    }
}

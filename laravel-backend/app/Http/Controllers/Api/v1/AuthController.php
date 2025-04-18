<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\v1\UserResource;
use App\Models\professor_email;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{

    /**
     * Checks if the email is in professor_emails table
     * @param mixed $email
     * @return bool
     */
    private function checkIfProfessor($email){
        $exits = professor_email::where("email", $email)->exists();
        return $exits;
    }
    
    /**
     * Summary of register
     * @param \App\Http\Requests\StoreUserRequest $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function register(StoreUserRequest $request)  {

        // Checks if the email is in professor_emails
        $isProfessor = $this->checkIfProfessor($request->email);
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => $isProfessor ? "professor" : "student",
            'linkedin_url' => $request->linkedin_url,
        ]);

        

        // $user->sendEmailVerificationNotification();
        event(new Registered($user));

        return response()->json([
            'user' => new UserResource($user),
            'message' => 'User registered successfully',
            "isProfessor" => $isProfessor
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

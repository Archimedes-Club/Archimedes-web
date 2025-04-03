<?php

use App\Http\Controllers\Api\v1\AdminController;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\ProjectMembershipController;
use App\Http\Controllers\Api\v1\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\ProjectController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;


// Routes that are allowed to Authenicated Users
Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\v1', 'middleware'=>['auth:sanctum', 'verified']], function(){

    // Project Model Routes
    Route::apiResource('projects', ProjectController::class);

    // User Data Manipulation Routes
    Route::get('/user', [UserController::class, 'get']);

    Route::put('/user',[UserController::class, 'update']);

    Route::patch('/user',[UserController::class, 'update']);

    Route::delete('/user', [UserController::class,'delete']);

    /**
     * Project Membership Routes
    */
    // Get all the membership details 
    Route::get('/project_memberships', [ProjectMembershipController::class, 'index']);

    //Get all the projects that the authenticated user is enrolled to
    Route::get('/project_memberships_user', [ProjectMembershipController::class, 'getUserProjects']);

    // Get all the projects of the users with user_id
    Route::get('/project_memberships_user/{user_id}', [ProjectMembershipController::class, 'getProjectsByUserId']);

    // Add user to project
    Route::post('/project_memberships', [ProjectMembershipController::class, 'addUserToProject']);

    // Get the project_membership by id
    Route::get('/project_memberships/{id}', [ProjectMembershipController::class, 'show']);

    // Update Project Membership by ID 
    Route::put('/project_memberships/{id}', [ProjectMembershipController::class, 'updateById']);

    //Update Project Membership by finding one using the foriegn keys in request body
    Route::put('/project_memberships', [ProjectMembershipController::class, 'updateByPivot']);

    // Remove the project membership between a project and user by forign keys
    Route::delete('/project_memberships', [ProjectMembershipController::class, 'removeUserFromProject']);
});

Route::post('/logout',[AuthController::class, 'logout'])->middleware(['auth:sanctum']);

// Register route
Route::post('/register',[AuthController::class, 'register']);

// Login route
Route::post('/login',[AuthController::class, 'login']);


// Route to check if the session data
Route::get('/debug-session', function (Request $request) {
    return response()->json([
        'session_data' => session()->all(),
        'auth_user' => Auth::user(),
    ]);
});


/**
 * Route to check if the user is logged in and has verified email
 */
Route::middleware('auth:sanctum')->get('/auth-status', function (Request $request) {
    return response()->json([
        'authenticated' => true,
        'email_verified' => $request->user()->hasVerifiedEmail()
    ]);
});

/**
 * Email Verification routes
 */
// This routes will get called once the user the verify user button in the email
Route::get('/email/verify/{id}/{hash}', function ($id, $hash, EmailVerificationRequest $request) {
    $request->fulfill(); // marks the user as verified
    return redirect("http://localhost:3000/login");
})->middleware(['auth','signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    if ($request->user()->hasVerifiedEmail()) {
        return response()->json(['message' => 'Already verified'], 200);
    }

    $request->user()->sendEmailVerificationNotification();

    return response()->json(['message' => 'Verification link sent'], 202);
})->middleware(['auth:sanctum', 'throttle:6,1'])->name('verification.send');



/**
 * ADMIN Routes
 */
Route::group(['prefix' => 'v1/admin', 'namespace' => 'App\Http\Controllers\Api\v1', 'middleware'=>['auth:sanctum', 'auth.admin']], function(){
    Route::get('/', function() {
        return "You're an Admin";
    });

    Route::get('/users', [AdminController::class, 'getAllUsers']);

    Route::put('/users/{id}', [AdminController::class,'updateUser']);
    
    Route::patch('/users/{id}', [AdminController::class,'updateUser']);
    
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

});
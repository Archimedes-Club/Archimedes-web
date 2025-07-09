<?php

use App\Http\Controllers\Api\v1\AdminController;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\ProjectMembershipController;
use App\Http\Controllers\Api\v1\UserController;
use App\Models\professor_email;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\ProjectController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;

// Routes that are allowed to Authenicated Users
Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\v1', 'middleware'=>['auth:sanctum', 'verified']], function(){

    // Project Model Routes
    Route::apiResource('projects', ProjectController::class);

    // User Data Manipulation Routes
    Route::get('/user', [UserController::class, 'get']);

    Route::put('/user',[UserController::class, 'update']);

    Route::patch('/user',[UserController::class, 'update']);
    
    /**
     * Project Membership Routes
    */
    // Get all the membership details 
    Route::get('/project_memberships', [ProjectMembershipController::class, 'index']);

    //Get all the projects that the authenticated user is enrolled to
    Route::get('/project_memberships_user', [ProjectMembershipController::class, 'getUserProjects']);

    // Get all the projects of the users with user_id
    Route::get('/project_memberships_user/{user_id}', [ProjectMembershipController::class, 'getProjectsByUserId']);

    // Get all the members in the project
    Route::get('/project_memberships/members/{project_id}',[ProjectMembershipController::class, 'getProjectMembers']);

    // Request to join a project 
    Route::post('/project_memberships/request', [ProjectMembershipController::class, 'requestToJoinProject']);

    // Approve the join request send by user (can only be done by the lead professor)
    Route::put('/project_memberships/approve', [ProjectMembershipController::class, 'approveRequest']);

    // Reject the join request send by user (can only be done by the lead professor)
    Route::put('/project_memberships/reject', [ProjectMembershipController::class, 'rejectRequest']);
   
    //Update Project Membership by finding one using the foriegn keys in request body
    Route::put('/project_memberships', [ProjectMembershipController::class, 'updateByPivot']);

    // Get all the join requests of recieved by authenticated professor from all the projects
    Route::get('/project_memberships/pending_requests', [ProjectMembershipController::class, 'getPendingRequests']);
    
    // Remove the project membership between a project and user by forign keys
    Route::delete('/project_memberships', [ProjectMembershipController::class, 'removeUserFromProject']);
});

/**
 * Route to get all public projects
 */
Route::get("/public-projects", [ProjectController::class, 'getPublicProjects']);

/**
 * Routes related to user auth
 */
Route::delete('/user', [UserController::class,'delete'])->middleware(['auth:sanctum']);

Route::post('/logout',[AuthController::class, 'logout'])->middleware(['auth:sanctum']);

// Register route
Route::post('/register',[AuthController::class, 'register']);

// Login route
Route::post('/login',[AuthController::class, 'login']);

// Route to send forget password link to user's email
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);

// Route to reset the password
Route::post('/reset-password', [NewPasswordController::class, 'store']);

/**
 * Routes relatedd to session 
 */
// Route to check if the session data
Route::get('/debug-session', function (Request $request) {
    return response()->json([
        'session_data' => session()->all(),
        'auth_user' => Auth::user(),
    ]);
});

Route::get('/ping', function(){
    return "server up and running";
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
    return redirect(env("FRONTEND_URL")+"/archimedes");
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

    Route::get("/checkProfessorEmail", function(Request $request){
        $retData = professor_email::where('email', $request->email)->exists();
        return response()->json($retData);
    });

    // Add user to project
    Route::post('/project_memberships', [ProjectMembershipController::class, 'addUserToProject']);

    // Update Project Membership by ID 
    Route::put('/project_memberships/{id}', [ProjectMembershipController::class, 'updateById']);

});
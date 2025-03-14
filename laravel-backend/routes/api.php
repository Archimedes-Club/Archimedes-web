<?php

use App\Http\Controllers\Api\v1\AdminController;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\UserController;
use GuzzleHttp\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\ProjectController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;


// Routes that are allowed to Authenicated Users
Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\v1', 'middleware'=>'auth:sanctum'], function(){

    // Project Model Routes
    Route::apiResource('projects', ProjectController::class);

    // User Routes
    Route::get('/user', [UserController::class, 'get']);

    Route::put('/user',[UserController::class, 'update']);

    Route::patch('/user',[UserController::class, 'update']);

    Route::delete('/user', [UserController::class,'delete']);

    Route::post('/logout',[AuthController::class, 'logout']);
});


// Routes that are allowed only to APP ADMINs
Route::group(['prefix' => 'v1/admin', 'namespace' => 'App\Http\Controllers\Api\v1', 'middleware'=>['auth:sanctum', 'auth.admin']], function(){
    Route::get('/', function() {
        return "You're an Admin";
    });

    Route::get('/users', [AdminController::class, 'getAllUsers']);

    Route::put('/users/{id}', [AdminController::class,'updateUser']);
    
    Route::patch('/users/{id}', [AdminController::class,'updateUser']);
    
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

});


Route::post('/register',[AuthController::class, 'register']);

Route::post('/login',[AuthController::class, 'login']);
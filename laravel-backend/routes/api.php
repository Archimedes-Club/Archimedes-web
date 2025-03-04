<?php

use App\Http\Controllers\Api\v1\ProjectController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\v1'], function(){
    Route::apiResource('projects', ProjectController::class);
});
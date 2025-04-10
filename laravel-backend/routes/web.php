<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get( '/login', function() {
    return redirect('http://localhost:3000/login');
});

require __DIR__.'/auth.php';

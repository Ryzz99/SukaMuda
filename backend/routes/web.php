<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['status' => 'SukaMuda API is Online'];
});

// Tambahkan ini agar named route 'login' tidak error
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');
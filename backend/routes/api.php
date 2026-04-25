<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ArticleController; 
use App\Http\Controllers\AuthController; 
use App\Http\Controllers\UserController; // 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - SUKAMUDA (SECURED VERSION)
|--------------------------------------------------------------------------
*/

// --- PUBLIC ROUTES (BASIC PROTECTION) ---
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
Route::post('/register', [RegisteredUserController::class, 'store']);

// TAMBAHKAN RATE LIMIT UNTUK MENCEGAH SPAM OTP (Maksimal 5x minta per jam per IP)
Route::middleware('throttle:5,60')->group(function () {
    Route::post('/resend-otp', [RegisteredUserController::class, 'resendOtp']);
    Route::post('/verify-otp', [RegisteredUserController::class, 'verifyOtp']);
    Route::post('/forgot-password/send-otp', [AuthController::class, 'sendResetOtp']);
    Route::post('/forgot-password/reset', [AuthController::class, 'resetPassword']);
});

// ARTIKEL (PUBLIC)
Route::get('/public-articles', [ArticleController::class, 'getPublicArticles']);
Route::get('/trending-articles', [ArticleController::class, 'getTrendingArticles']); // DITAMBAHKAN DI SINI
Route::get('/articles/{id}/view', [ArticleController::class, 'incrementView']);
Route::get('/articles/{id}/comments', [ArticleController::class, 'getComments']);


// --- PROTECTED ROUTES (HARUS LOGIN) ---
Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // --- FITUR PROFIL & STATISTIK (TAMBAHAN BARU) ---
    Route::get('/profile-data', [UserController::class, 'getProfile']); 
    Route::post('/profile-update', [UserController::class, 'updateProfile']);
    Route::post('/profile-password', [UserController::class, 'changePassword']);
    // ------------------------------------------------

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // SISTEM ARTIKEL (USER BIASA - MENULIS & BERINTERAKSI)
    Route::get('/articles', [ArticleController::class, 'index']);           
    Route::post('/articles', [ArticleController::class, 'store']);           

    // SISTEM KOMENTAR
    Route::post('/articles/{id}/comments', [ArticleController::class, 'storeComment']);
    Route::delete('/comments/{id}', [ArticleController::class, 'deleteComment']);

    // SISTEM INTERAKSI
    Route::post('/articles/{id}/like', [ArticleController::class, 'toggleLike']);
    Route::post('/articles/{id}/bookmark', [ArticleController::class, 'toggleBookmark']);

    // --- AREA ADMIN (DIPISAH PAKAI MIDDLEWARE ADMIN) ---
    Route::middleware('admin')->group(function () {
        Route::patch('/articles/{id}/status', [ArticleController::class, 'updateStatus']); 
        Route::delete('/articles/{id}', [ArticleController::class, 'destroy']); 
    });

});
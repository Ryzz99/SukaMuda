<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ArticleController; 
use App\Http\Controllers\AuthController; 
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Middleware\CheckAdminRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - SUKAMUDA
|--------------------------------------------------------------------------
*/

// --- 1. PUBLIC ROUTES (Tanpa Login) ---
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
Route::post('/register', [RegisteredUserController::class, 'store']);

// Rate Limiting untuk OTP & Reset Password
Route::middleware('throttle:5,60')->group(function () {
    Route::post('/resend-otp', [RegisteredUserController::class, 'resendOtp']);
    Route::post('/verify-otp', [RegisteredUserController::class, 'verifyOtp']);
    Route::post('/forgot-password/send-otp', [AuthController::class, 'sendResetOtp']);
    Route::post('/forgot-password/reset', [AuthController::class, 'resetPassword']);
});

// Konten Publik (Artikel)
Route::get('/public-articles', [ArticleController::class, 'getPublicArticles']);
Route::get('/trending-articles', [ArticleController::class, 'getTrendingArticles']);
Route::get('/articles/{id}/view', [ArticleController::class, 'incrementView']);
Route::get('/articles/{id}/comments', [ArticleController::class, 'getComments']);


// --- 2. PROTECTED ROUTES (Wajib Login/Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // --- AUTH & USER INFO ---
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // --- PROFILE PAGE ROUTES ---
    // Dipakai oleh Profile.jsx untuk mengambil data User + Artikel (Posts, Review, Draft, Favorite)
    Route::get('/profile', [ProfileController::class, 'index']);
    Route::post('/profile', [ProfileController::class, 'update']);

    // --- MANAJEMEN PROFIL (SETTINGS) ---
    Route::prefix('user')->group(function () {
        Route::get('/profile', [ProfileController::class, 'getProfile']); 
        Route::post('/profile', [ProfileController::class, 'updateProfile']);
        Route::put('/password', [ProfileController::class, 'changePassword']);
        Route::delete('/account', [ProfileController::class, 'deleteAccount']);
    });

    // --- SISTEM ARTIKEL (CRUD & INTERAKSI) ---
    Route::get('/articles', [ArticleController::class, 'index']);           
    Route::post('/articles', [ArticleController::class, 'store']);          // Simpan artikel baru
    
    // PERBAIKAN: Menggunakan PUT/PATCH untuk update. Jangan gunakan POST dengan URL yang sama dengan create.
    Route::put('/articles/{id}', [ArticleController::class, 'update']);      // Update artikel (Standar REST)
    
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy']); 

    // Interaksi User terhadap Artikel
    Route::post('/articles/{id}/like', [ArticleController::class, 'toggleLike']);
    Route::post('/articles/{id}/bookmark', [ArticleController::class, 'toggleBookmark']);
    Route::post('/articles/{id}/comments', [ArticleController::class, 'storeComment']);
    Route::delete('/comments/{id}', [ArticleController::class, 'deleteComment']);

    // --- 3. AREA ADMIN ---
    Route::middleware(CheckAdminRole::class)->group(function () {
        // Update status approved/rejected/pending
        Route::patch('/articles/{id}/status', [ArticleController::class, 'updateStatus']); 
    });
});
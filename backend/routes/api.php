<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - SUKAMUDA
|--------------------------------------------------------------------------
| Jalur ini otomatis memiliki prefix /api.
| Contoh: http://127.0.0.1:8000/api/register
*/

// --- AUTHENTICATION ---

// 1. LOGIN (Wajib punya ->name('login') agar tidak error 404 saat session habis)
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');

// 2. LOGOUT (Hanya bisa diakses jika user sudah login/punya token)
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum')
    ->name('logout');

// 3. GET USER DATA (Untuk cek status login di React)
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


// --- REGISTRATION FLOW (OTP SYSTEM) ---

// 4. TAHAP 1: Register awal (Validasi input & kirim kode OTP ke email)
Route::post('/register', [RegisteredUserController::class, 'store']);

// 5. TAHAP KHUSUS: Kirim ulang kode OTP (Jika kode tidak masuk atau expired)
Route::post('/resend-otp', [RegisteredUserController::class, 'resendOtp']);

// 6. TAHAP 2: Verifikasi Kode & Pembuatan Akun secara permanen
Route::post('/verify-otp', [RegisteredUserController::class, 'verifyOtp']);
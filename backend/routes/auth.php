<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

// --- PROSES REGISTER & OTP (GUEST) ---
Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware(['guest', 'web'])
    ->name('register');

// Route khusus untuk Verifikasi Kode OTP 6 Digit
Route::post('/verify-otp', [RegisteredUserController::class, 'verifyOtp'])
    ->middleware(['guest', 'web'])
    ->name('otp.verify');

// Route khusus untuk Kirim Ulang OTP
Route::post('/resend-otp', [RegisteredUserController::class, 'resendOtp'])
    ->middleware('guest')
    ->name('otp.resend');


// --- PROSES LOGIN & PASSWORD (GUEST) ---
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware(['guest', 'web'])
    ->name('login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')
    ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest')
    ->name('password.store');


// --- PROSES AUTH (HANYA JIKA SUDAH LOGIN) ---
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// Link Verifikasi Email bawaan (Bisa tetap dibiarkan atau dihapus jika sudah pakai OTP)
Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');
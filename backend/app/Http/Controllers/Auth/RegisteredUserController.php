<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Otp;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class RegisteredUserController extends Controller
{
    /**
     * TAHAP 1: Menerima Pendaftaran & Kirim OTP Awal
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed'],
        ]);

        $otpCode = rand(100000, 999999);

        try {
            // Update atau buat OTP baru (Berlaku 15 Menit)
            Otp::updateOrCreate(
                ['email' => $request->email],
                [
                    'otp'        => $otpCode,
                    'expires_at' => Carbon::now()->addMinutes(15)
                ]
            );

            // Kirim Email
            Mail::raw("Halo {$request->name},\n\nKode verifikasi SukaMuda kamu adalah: {$otpCode}\n\nKode ini berlaku selama 15 menit. Jangan bagikan kode ini kepada siapapun.", function ($message) use ($request) {
                $message->to($request->email)
                        ->subject('Kode Verifikasi SukaMuda');
            });

            return response()->json([
                'status'  => 'success',
                'message' => 'OTP berhasil dikirim ke email'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal kirim email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * FITUR: Kirim Ulang OTP
     */
    public function resendOtp(Request $request): JsonResponse
    {
        // Validasi email harus ada agar tidak error
        $request->validate(['email' => 'required|email']);
        
        $otpCode = rand(100000, 999999);

        try {
            // Pastikan data OTP diupdate dengan yang baru
            Otp::updateOrCreate(
                ['email' => $request->email],
                [
                    'otp'        => $otpCode, 
                    'expires_at' => Carbon::now()->addMinutes(15)
                ]
            );

            Mail::raw("Ini adalah kode verifikasi BARU kamu: {$otpCode}\n\nBerlaku selama 15 menit.", function ($message) use ($request) {
                $message->to($request->email)
                        ->subject('Kode Baru SukaMuda');
            });

            return response()->json([
                'status'  => 'success',
                'message' => 'Kode baru berhasil dikirim!'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal kirim ulang: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * TAHAP 2: Verifikasi OTP & Buat Akun
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'otp'      => 'required|string|size:6',
            'name'     => 'required|string',
            'password' => 'required',
        ]);

        // 1. Cari data OTP yang cocok
        $otpData = Otp::where('email', $request->email)
                      ->where('otp', $request->otp)
                      ->first();

        if (!$otpData) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Kode OTP salah atau tidak ditemukan!'
            ], 422);
        }

        // 2. Cek Kadaluwarsa
        if (Carbon::parse($otpData->expires_at)->isPast()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Kode OTP sudah kadaluwarsa, silakan kirim ulang!'
            ], 422);
        }

        // 3. Cek apakah user sudah terdaftar (double protection)
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Email ini sudah terdaftar.'
            ], 422);
        }

        try {
            // 4. Buat Akun User
            $user = User::create([
                'name'              => $request->name,
                'email'             => $request->email,
                'password'          => Hash::make($request->password),
                'email_verified_at' => Carbon::now(),
            ]);

            // 5. Hapus OTP yang sudah sukses dipakai
            $otpData->delete();

            // 6. Login Otomatis (Sanctum Session)
            Auth::login($user);

            return response()->json([
                'status'  => 'success',
                'message' => 'Verifikasi berhasil, akun telah aktif!',
                'user'    => $user
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Proses pembuatan akun gagal: ' . $e->getMessage()
            ], 500);
        }
    }
}
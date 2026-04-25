<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Otp;
use App\Mail\RegisterOtpMail; // Gunakan Mailer yang baru
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
     * REVISI: Menggunakan Queue agar tidak loading lama
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

            // KIRIM EMAIL PAKE QUEUE (Daftar jadi Cepet!)
            Mail::to($request->email)->send(new RegisterOtpMail($request->name, $otpCode));

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
     * REVISI: Menggunakan Queue
     */
    public function resendOtp(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);
        
        $otpCode = rand(100000, 999999);

        try {
            Otp::updateOrCreate(
                ['email' => $request->email],
                [
                    'otp'        => $otpCode, 
                    'expires_at' => Carbon::now()->addMinutes(15)
                ]
            );

            // KIRIM ULANG PAKE QUEUE
            Mail::to($request->email)->send(new RegisterOtpMail('User SukaMuda', $otpCode));

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

        $otpData = Otp::where('email', $request->email)
                      ->where('otp', $request->otp)
                      ->first();

        if (!$otpData) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Kode OTP salah atau tidak ditemukan!'
            ], 422);
        }

        if (Carbon::parse($otpData->expires_at)->isPast()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Kode OTP sudah kadaluwarsa, silakan kirim ulang!'
            ], 422);
        }

        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Email ini sudah terdaftar.'
            ], 422);
        }

        try {
            $user = User::create([
                'name'              => $request->name,
                'email'             => $request->email,
                'password'          => Hash::make($request->password),
                'email_verified_at' => Carbon::now(),
            ]);

            $otpData->delete();

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
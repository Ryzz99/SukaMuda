<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; // Ubah ke JsonResponse
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        // 1. Proses Autentikasi
        $request->authenticate();

        // 2. Regenerate Session (Keamanan)
        $request->session()->regenerate();

        // 3. Kirim data user ke React biar bisa disimpan di AuthContext
        return response()->json([
            'message' => 'Login berhasil!',
            'user' => Auth::user(),
        ], 200);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Berhasil logout'
        ], 200);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DebugController extends Controller
{
    /**
     * Test Password Verification
     * Usage: POST /api/debug/test-password
     * Body: { "email": "user@example.com", "password": "password_plaintext" }
     */
    public function testPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'error' => 'User tidak ditemukan',
                'email' => $request->email
            ], 404);
        }

        // Debug: Tampilkan informasi user
        $passwordMatch = Hash::check($request->password, $user->password);

        return response()->json([
            'email' => $user->email,
            'name' => $user->name,
            'password_field_from_db' => substr($user->password, 0, 10) . '...', // Jangan tampilkan full hash
            'input_password' => $request->password,
            'password_match' => $passwordMatch,
            'hash_algorithm' => $this->detectHashAlgorithm($user->password),
            'message' => $passwordMatch ? 'Password BENAR ✓' : 'Password SALAH ✗'
        ]);
    }

    /**
     * List semua user dan passwordnya (untuk debugging)
     */
    public function listUsers()
    {
        $users = User::select('id', 'name', 'email', 'password')->get();

        return response()->json([
            'users' => $users->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'password_sample' => substr($u->password, 0, 15) . '...',
                'password_length' => strlen($u->password),
                'hash_type' => $this->detectHashAlgorithm($u->password)
            ])
        ]);
    }

    private function detectHashAlgorithm($hash)
    {
        if (strpos($hash, '$2y$') === 0 || strpos($hash, '$2a$') === 0) {
            return 'bcrypt';
        } elseif (strpos($hash, '$argon2id$') === 0) {
            return 'argon2id';
        } elseif (strpos($hash, '$argon2i$') === 0) {
            return 'argon2i';
        }
        return 'unknown';
    }
}

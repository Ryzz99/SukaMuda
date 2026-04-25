<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Article;
use App\Models\ArticleLike;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * 1. AMBIL DATA PROFIL & STATISTIK (DASHBOARD PROFIL)
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();

        // Statistik kumulatif untuk gengsi penulis
        $stats = [
            'total_articles' => Article::where('user_id', $user->id)->where('status', 'approved')->count(),
            'total_views'    => Article::where('user_id', $user->id)->sum('views'),
            'total_likes'    => ArticleLike::whereHas('article', function($q) use ($user) {
                                    $q->where('user_id', $user->id);
                                })->count(),
            'pending_count'  => Article::where('user_id', $user->id)->where('status', 'pending')->count(),
            'draft_count'    => Article::where('user_id', $user->id)->where('status', 'draft')->count(),
        ];

        return response()->json([
            'status' => 'success',
            'user'   => $user,
            'stats'  => $stats
        ]);
    }

    /**
     * 2. UPDATE PROFIL (NAMA, BIO, AVATAR, SOSMED)
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'          => 'required|string|max:255',
            'bio'           => 'nullable|string|max:150',
            'instagram_url' => 'nullable|string',
            'linkedin_url'  => 'nullable|string',
            'avatar'        => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB
        ]);

        // LOGIC UPLOAD AVATAR
        if ($request->hasFile('avatar')) {
            // Hapus foto lama di storage/avatars biar gak numpuk (Security & Efficiency)
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Simpan foto baru ke folder 'avatars' di disk public
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        $user->name = $request->name;
        $user->bio = $request->bio;
        $user->instagram_url = $request->instagram_url;
        $user->linkedin_url = $request->linkedin_url;
        $user->save();

        return response()->json([
            'message' => 'Profil SukaMuda berhasil diperbarui!',
            'user'    => $user
        ]);
    }

    /**
     * 3. GANTI PASSWORD (SECURITY)
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        // Cek apakah password lama bener
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Password lama tidak sesuai!'], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password berhasil diubah!']);
    }
}
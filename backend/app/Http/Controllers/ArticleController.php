<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Comment;
use App\Models\ArticleLike;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller
{
    // 1. Dashboard Admin - Search, Filter, & Pagination Server-Satejarus
    public function index(Request $request)
    {
        $query = Article::with('user')->withCount('likes');

        // FITUR SEARCH: GANTI LIKE JADI whereFullText (100x LEBIH CEPAT UNTUK DATA BESAR)
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                try {
                    $q->whereFullText('title', $search);
                } catch (\Exception $e) {
                    $q->where('title', 'LIKE', "%{$search}%");
                }
                
                $q->orWhereHas('user', function($u) use ($search) {
                    $u->where('name', 'LIKE', "%{$search}%");
                });
            });
        }

        // FITUR FILTER: Status
        if ($request->has('status') && $request->status != 'all') {
            $query->where('status', $request->status);
        }

        // FITUR FILTER: Kategori
        if ($request->has('category') && $request->category != 'all') {
            $query->where('category', $request->category);
        }

        // Ambil data terbaru
        $articles = $query->latest()->paginate(15);

        return response()->json($articles);
    }

    // 2. Halaman Depan (Public)
    public function getPublicArticles(Request $request)
    {
        $user = $request->user('sanctum');

        $articles = Article::where('status', 'approved')
            ->with('user')
            ->withCount('likes');

        // OPTIMASI: Hanya cek "is_liked_by_user" JIKA USER SEDANG LOGIN
        // Kalau tamu (null), jangan buang resource database untuk mengecek like milik null.
        if ($user) {
            $articles->withExists(['likes as is_liked_by_user' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }]);
        }

        $articles = $articles->latest()->paginate(50);

        return response()->json($articles->items())->header('Cache-Control', 'no-store, no-cache, must-revalidate');
    }

    // --- FITUR TRENDING BARU ---
    public function getTrendingArticles(Request $request)
    {
        $user = $request->user('sanctum');

        $articles = Article::where('status', 'approved')
            ->with('user')
            ->withCount(['likes', 'comments', 'views'])
            ->select('id', 'title', 'slug', 'category', 'summary', 'image', 'user_id', 'created_at', 'updated_at')
            ->addSelect(DB::raw('(likes_count * 3) + (comments_count * 5) + (views_count) as popularity_score'))
            ->orderByDesc('popularity_score')
            ->paginate(20);

        if ($user) {
            $articles->withExists(['likes as is_liked_by_user' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }]);
        }

        return response()->json($articles->items())->header('Cache-Control', 'no-store, no-cache, must-revalidate');
    }

    // 3. Fungsi Kirim Berita
    public function store(Request $request)
    {
        $request->validate([
            'title'    => 'required|string|max:255',
            'category' => 'required|string',
            'summary'  => 'nullable|string|max:500',
            'tags'     => 'nullable|string',
            'content'  => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('articles', 'public');
        }

        $user = $request->user();
        $status = ($user && $user->role === 'admin') ? 'approved' : 'pending';

        $article = Article::create([
            'user_id'  => $user->id,
            'title'    => $request->title,
            'slug'     => Str::slug($request->title) . '-' . time(), 
            'category' => $request->category,
            'summary'  => $request->summary, 
            'tags'     => $request->tags,    
            'content'  => $request->content,
            'image'    => $imagePath,
            'status'   => $status, 
        ]);

        Cache::flush();

        return response()->json([
            'message' => $status === 'approved' ? 'Berita berhasil diterbitkan!' : 'Berita berhasil dikirim, tunggu tinjauan admin!',
            'data' => $article
        ], 201);
    }

    // 4. Update Status (Approve/Reject)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected,pending'
        ]);

        $article = Article::findOrFail($id);
        $article->status = $request->status;
        $article->save();

        Cache::flush();

        return response()->json([
            'message' => 'Status berita berhasil diubah menjadi ' . $request->status
        ]);
    }

    // 5. Fitur Hapus Artikel (Destroy)
    public function destroy(Request $request, $id)
    {
        try {
            $article = Article::findOrFail($id);

            if ($article->image) {
                Storage::disk('public')->delete($article->image);
            }

            $article->delete();

            Cache::flush();

            return response()->json(['message' => 'Artikel berhasil dihapus!'], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal hapus: ' . $e->getMessage()], 500);
        }
    }

    // --- FITUR KOMENTAR ---
    public function getComments($id)
    {
        $comments = Comment::where('article_id', $id)->with('user')->latest()->paginate(20);
        return response()->json($comments->items());
    }

    public function storeComment(Request $request, $id)
    {
        $request->validate(['body' => 'required|string']);
        $comment = Comment::create([
            'article_id' => $id,
            'user_id' => $request->user()->id,
            'body' => $request->body
        ]);
        return response()->json($comment->load('user'), 201);
    }

    public function deleteComment(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
        if ($request->user()->id !== $comment->user_id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $comment->delete();
        return response()->json(['message' => 'Komentar terhapus!']);
    }

    // --- FITUR LIKE ---
    public function toggleLike(Request $request, $id)
    {
        $user = $request->user();
        $like = ArticleLike::where('user_id', $user->id)->where('article_id', $id)->first();

        if ($like) {
            $like->delete();
            $status = 'unliked';
        } else {
            ArticleLike::create(['user_id' => $user->id, 'article_id' => $id]);
            $status = 'liked';
        }

        return response()->json([
            'status' => $status,
            'likes_count' => ArticleLike::where('article_id', $id)->count()
        ]);
    }
}
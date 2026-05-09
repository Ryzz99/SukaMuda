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
    /**
     * Helper untuk mengubah path gambar menjadi URL lengkap
     */
    private function transformArticles($articles)
    {
        $articles->getCollection()->transform(function ($article) {
            if ($article->image) {
                if (!filter_var($article->image, FILTER_VALIDATE_URL)) {
                    $article->image = asset('storage/' . $article->image);
                }
            }
            return $article;
        });
        return $articles;
    }

    public function index(Request $request)
    {
        $query = Article::with('user')->withCount('likes');

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

        if ($request->has('status') && $request->status != 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('category') && $request->category != 'all') {
            $query->where('category', $request->category);
        }

        $articles = $query->latest()->paginate(15);
        return response()->json($this->transformArticles($articles));
    }

    public function getPublicArticles(Request $request)
    {
        $user = $request->user('sanctum');
        $query = Article::where('status', 'approved')->with('user')->withCount('likes');

        if ($user) {
            $query->withExists(['likes as is_liked_by_user' => function ($q) use ($user) {
                $q->where('user_id', $user->id);
            }]);
        }

        $articles = $query->latest()->paginate(50);
        $this->transformArticles($articles);
        return response()->json($articles->items())->header('Cache-Control', 'no-store, no-cache, must-revalidate');
    }

    public function getTrendingArticles(Request $request)
    {
        $user = $request->user('sanctum');
        $articles = Article::where('status', 'approved')
            ->with('user')
            ->withCount(['likes', 'comments'])
            ->select('id', 'title', 'slug', 'category', 'summary', 'image', 'user_id', 'views', 'created_at', 'updated_at')
            ->addSelect(DB::raw('((SELECT COUNT(*) FROM article_likes WHERE article_likes.article_id = articles.id) * 3) + ((SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.id) * 5) + (views) as popularity_score'))
            ->orderByDesc('popularity_score')
            ->paginate(20);

        $articles->getCollection()->each(function ($article) use ($user) {
            if ($article->image && !filter_var($article->image, FILTER_VALIDATE_URL)) {
                $article->image = asset('storage/' . $article->image);
            }
            if ($user) $article->is_liked_by_user = $article->likes()->where('user_id', $user->id)->exists();
        });

        return response()->json($articles->items());
    }

    /**
     * FUNGSI SIMPAN ARTIKEL BARU
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'    => 'required|string|max:255',
            'category' => 'required|string',
            'summary'  => 'nullable|string|max:500',
            'content'  => 'required|string',
            'image'    => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'status'   => 'nullable|string|in:draft,review,published,approved,pending'
        ]);

        $user = $request->user();
        $imagePath = $request->hasFile('image') ? $request->file('image')->store('articles', 'public') : null;

        $finalStatus = $request->status;
        if (!$finalStatus || $finalStatus === 'published' || $finalStatus === 'review') {
            $finalStatus = ($user->role === 'admin') ? 'approved' : 'pending';
        }

        $article = Article::create([
            'user_id'  => $user->id,
            'title'    => $request->title,
            'slug'     => Str::slug($request->title) . '-' . time(),
            'category' => $request->category,
            'summary'  => $request->summary,
            'content'  => $request->content,
            'image'    => $imagePath,
            'status'   => $finalStatus,
            'tags'     => $request->tags,
            'views'    => 0
        ]);

        if ($article->image) {
            $article->image = asset('storage/' . $article->image);
        }

        Cache::flush();
        return response()->json(['message' => 'Berita berhasil dibuat!', 'data' => $article], 201);
    }

    /**
     * FUNGSI UPDATE ARTIKEL (Perbaikan Error 500)
     */
    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        $user = $request->user();

        // Pastikan hanya pemilik atau admin yang bisa update
        if ($article->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title'    => 'required|string|max:255',
            'category' => 'required|string',
            'summary'  => 'nullable|string|max:500',
            'content'  => 'required|string',
            'image'    => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'status'   => 'nullable|string'
        ]);

        if ($request->hasFile('image')) {
            if ($article->image) {
                Storage::disk('public')->delete($article->image);
            }
            $article->image = $request->file('image')->store('articles', 'public');
        }

        $article->title = $request->title;
        $article->category = $request->category;
        $article->summary = $request->summary;
        $article->content = $request->content;
        $article->tags = $request->tags;
        
        if ($request->has('status')) {
            $article->status = $request->status;
        }

        $article->save();
        Cache::flush();

        return response()->json(['message' => 'Berita berhasil diperbarui!', 'data' => $article]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:approved,rejected,pending,draft']);
        $article = Article::findOrFail($id);
        $article->update(['status' => $request->status]);
        Cache::flush();
        return response()->json(['message' => 'Status berhasil diubah']);
    }

    public function destroy(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        
        if ($article->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($article->image) {
            Storage::disk('public')->delete($article->image);
        }

        $article->delete();
        Cache::flush();
        return response()->json(['message' => 'Artikel berhasil dihapus!']);
    }

    public function incrementView($id)
    {
        $article = Article::findOrFail($id);
        $article->increment('views');
        return response()->json(['views' => $article->views]);
    }

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

    public function toggleLike(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $like = ArticleLike::where('user_id', $user->id)->where('article_id', $id)->first();
        
        if ($like) {
            $like->delete();
            $status = 'unliked';
        } else {
            ArticleLike::create(['user_id' => $user->id, 'article_id' => $id]);
            $status = 'liked';
        }

        $likesCount = ArticleLike::where('article_id', $id)->count();

        return response()->json([
            'message' => 'Success',
            'status' => $status,
            'likes_count' => $likesCount
        ]);
    }
}
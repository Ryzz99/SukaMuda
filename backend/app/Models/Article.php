<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Article extends Model
{
    // Daftar kolom yang diizinkan untuk diisi data
    protected $fillable = [
        'user_id', 
        'title', 
        'slug', 
        'category', 
        'image', 
        'summary',
        'content',
        'tags', 
        'status'
    ];

    /**
     * Relasi ke User (Penulis Berita)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Komentar
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Relasi ke Like (WAJIB DITAMBAHKAN BI)
     */
    public function likes(): HasMany
    {
        return $this->hasMany(ArticleLike::class);
    }
}
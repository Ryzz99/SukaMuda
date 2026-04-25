<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    // Kolom yang boleh diisi lewat React
    protected $fillable = ['article_id', 'user_id', 'body'];

    // Relasi: Setiap komentar pasti punya penulis (User)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi: Setiap komentar nempel di satu berita (Article)
    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail; 
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        // --- KOLOM BARU UNTUK PROFIL (WAJIB DITAMBAHKAN) ---
        'avatar',
        'bio',
        'instagram_url',
        'linkedin_url',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relasi: Satu User bisa nulis banyak Berita
     */
    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

    /**
     * Relasi: Satu User bisa memberikan banyak Komentar
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
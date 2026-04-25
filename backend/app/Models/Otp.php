<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Otp extends Model
{
    // Menentukan nama tabel (opsional, tapi bagus untuk keamanan)
    protected $table = 'otps';

    // Kolom yang boleh diisi secara massal
    protected $fillable = [
        'email',
        'otp',
        'expires_at',
    ];

    /**
     * Memastikan kolom expires_at dibaca sebagai tanggal/waktu
     */
    protected $casts = [
        'expires_at' => 'datetime',
    ];
}
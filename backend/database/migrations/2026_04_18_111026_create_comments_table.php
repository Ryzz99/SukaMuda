\<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke tabel articles (Berita mana yang dikomen?)
            // onDelete('cascade') artinya kalau beritanya dihapus, komennya ikut kehapus
            $table->foreignId('article_id')->constrained('articles')->onDelete('cascade');
            
            // Relasi ke tabel users (Siapa yang nulis komen?)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Isi komentar
            $table->text('body');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
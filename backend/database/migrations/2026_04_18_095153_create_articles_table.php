<?php

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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            // Menghubungkan ke tabel users (siapa penulisnya)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category');
            $table->string('image')->nullable();
            
            // Kita pakai nama 'summary' agar sinkron dengan Controller dan React
            $table->text('summary')->nullable(); 
            
            $table->text('content');
            
            // Status berita: pending (nunggu admin), approved (terbit), rejected (ditolak)
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            
            $table->text('tags')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
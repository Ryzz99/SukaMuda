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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('article_id')->constrained()->onDelete('cascade');
            $table->foreignId('triggered_by_user_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Tipe notifikasi: 'article_approved', 'article_rejected', 'article_liked'
            $table->string('type');
            
            // Pesan notifikasi yang ditampilkan
            $table->text('message');
            
            // Untuk article_rejected, simpan alasan penolakan
            $table->text('rejection_reason')->nullable();
            
            // Untuk article_liked, simpan nama user yang like
            $table->string('triggered_by_user_name')->nullable();
            
            // Status: read/unread
            $table->boolean('is_read')->default(false);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};

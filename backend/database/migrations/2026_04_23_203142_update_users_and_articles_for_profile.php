<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // 1. Update Tabel Users (Identitas & Sosmed)
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('email');
            $table->string('bio', 150)->nullable()->after('avatar');
            $table->string('instagram_url')->nullable();
            $table->string('linkedin_url')->nullable();
        });

        // 2. Update Tabel Articles (Statistik)
        Schema::table('articles', function (Blueprint $table) {
            if (!Schema::hasColumn('articles', 'views')) {
                $table->unsignedBigInteger('views')->default(0)->after('content'); 
            }
        });
    }

    public function down()
    {
        // Fungsi Rollback: Buat hapus kolom kalau lo cancel migrasinya
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['avatar', 'bio', 'instagram_url', 'linkedin_url']);
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn('views');
        });
    }
};
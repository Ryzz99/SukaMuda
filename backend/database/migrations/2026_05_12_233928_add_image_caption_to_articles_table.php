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
        Schema::table('articles', function (Blueprint $table) {
            // Kita tambahkan kolom image_caption di sini
            // nullable() artinya boleh dikosongkan
            // after('image') artinya posisinya ditaruh setelah kolom image
            $table->string('image_caption')->nullable()->after('image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            // Ini untuk menghapus kolom jika migration di-rollback
            $table->dropColumn('image_caption');
        });
    }
};
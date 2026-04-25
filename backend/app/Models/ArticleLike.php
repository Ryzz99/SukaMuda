<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleLike extends Model
{
    // Biar bisa input data lewat ArticleLike::create
    protected $fillable = ['user_id', 'article_id'];
}
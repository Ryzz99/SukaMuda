<?php
use Illuminate\Support\Facades\Route;

// Biarkan kosong begini saja untuk halaman depan backend
Route::get('/', function () {
    return ['status' => 'SukaMuda API is Online'];
});
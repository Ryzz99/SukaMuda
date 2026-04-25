<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    // 1. Tambahkan semua route yang dipakai React ke dalam paths
    'paths' => [
        'api/*', 
        'sanctum/csrf-cookie', 
        'login', 
        'register', 
        'logout', 
        'verify-otp', // WAJIB ADA
        'resend-otp', // WAJIB ADA
        'verify-email'
    ],

    'allowed_methods' => ['*'],

    // 2. Pastikan semua alamat lokal yang mungkin dipakai React terdaftar
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5174'),
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // 3. WAJIB TRUE: Agar cookie session/CSRF bisa nyebrang dari port 8000 ke 5174
    'supports_credentials' => true,

];
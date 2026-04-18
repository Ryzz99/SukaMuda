<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request; // Tambahkan ini di atas

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        
        // 1. Mengaktifkan stateful API agar Cookie Sanctum bisa jalan
        $middleware->statefulApi();

        // 2. Tambahkan middleware Sanctum untuk request dari Frontend
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        // 3. Kecualikan route ini dari CSRF jika kamu masih sering kena Error 419
        $middleware->validateCsrfTokens(except: [
            'register',
            'login',
            'verify-otp',
            'resend-otp',
            'api/*', // Opsional: buka semua jalur api jika masih elor
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        
        // 4. KUNCI UTAMA: Paksa Laravel merespon JSON jika ada error
        // Ini yang bikin pesan "Route login not found" hilang!
        $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
            if ($request->is('api/*')) {
                return true;
            }
            return $request->expectsJson();
        });

    })->create();
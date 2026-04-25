<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 1. Pastikan skema URL menggunakan http di lokal agar tidak bentrok dengan SSL
        if (app()->isLocal()) {
            URL::forceScheme('http');
        }

        // 2. Konfigurasi Reset Password agar mengarah ke URL Frontend React
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        // 3. Pengaturan Keamanan Sanctum (Opsional tapi bagus untuk kestabilan Cookie)
        Sanctum::usePersonalAccessTokenModel(\Laravel\Sanctum\PersonalAccessToken::class);
    }
}
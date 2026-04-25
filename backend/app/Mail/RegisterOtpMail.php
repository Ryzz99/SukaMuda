<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue; // <--- WAJIB: Biar masuk antrean

class RegisterOtpMail extends Mailable implements ShouldQueue // <--- WAJIB: Pake implements
{
    use Queueable, SerializesModels;

    public $name;
    public $otpCode;

    public function __construct($name, $otpCode)
    {
        $this->name = $name;
        $this->otpCode = $otpCode;
    }

    public function build()
    {
        return $this->subject('Kode Verifikasi SukaMuda')
                    ->html("Halo <b>{$this->name}</b>,<br><br>Kode verifikasi SukaMuda kamu adalah: <h2 style='color:#d83a34;'>{$this->otpCode}</h2><br>Kode ini berlaku selama 15 menit.");
    }
}
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue; // Import ini

class ResetPasswordMail extends Mailable implements ShouldQueue // Tambahkan ShouldQueue
{
    use Queueable, SerializesModels;

    public $otp;

    public function __construct($otp)
    {
        $this->otp = $otp;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Kode OTP Reset Sandi SukaMuda',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reset_otp', 
        );
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'article_id' => 'required|exists:articles,id',
            'reason' => 'required|string|max:1000',
        ]);

        // Cek apakah user sudah report artikel ini
        $existingReport = Report::where('user_id', Auth::id())
            ->where('article_id', $request->article_id)
            ->first();

        if ($existingReport) {
            return response()->json(['message' => 'Anda sudah melaporkan artikel ini.'], 400);
        }

        $report = Report::create([
            'user_id' => Auth::id(),
            'article_id' => $request->article_id,
            'reason' => $request->reason,
        ]);

        return response()->json(['message' => 'Laporan berhasil dikirim.', 'report' => $report], 201);
    }

    public function index()
    {
        $reports = Report::with(['user', 'article'])->latest()->get();
        return response()->json(['data' => $reports]);
    }
}

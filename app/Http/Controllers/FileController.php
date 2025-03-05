<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function downloadFile(Request $request)
    {
        $fileName = $request->input('file_path');
        $fullPath = Storage::disk('public')->path($fileName);
        if (!file_exists($fullPath)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        return response()->download($fullPath);
    }
}

<?php

namespace App;

use Illuminate\Http\UploadedFile;

trait FileUpload
{
    public function uploadFile(UploadedFile $file, string $directory = 'uploads', string $disk = 'public'): string
    {
        // Generate a unique filename
        $fileName = time() . '.' . $file->getClientOriginalExtension();

        // Store the file with a custom name
        $filePath = $file->storeAs($directory, $fileName, $disk);

        // Return the file path (relative to "storage/")
        return $filePath;
    }
}

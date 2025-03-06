<?php

namespace App\Http\Controllers;

use App\FileUpload;
use App\Models\CommentReply;
use App\Models\TaskComment;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    use FileUpload;

    public function storeComment(Request $request)
    {
        $request->validate([
            'subTaskId' => 'required',
            'comment' => 'required',
        ]);

        try {
            $filePath = null;
            if ($request->file('filePath') instanceof UploadedFile) {
                // Upload the file and get the file path
                $filePath = $this->uploadFile($request->file('filePath'), 'uploads/files');
            }

            $userId = Auth::id();
            TaskComment::create([
                'user_id' => $userId,
                'sub_task_id' => $request->subTaskId,
                'comment' => $request->comment,
                'file_path' => $filePath
            ]);
            return response()->json(['message' => 'Comment added successfully'], 200);
            // return redirect()->back()->with('success', 'Comment added successfully');
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function storeReply(Request $request, $id)
    {
        $request->validate([
            'content' => 'required',
        ]);

        $userId = Auth::id();

        $filePath = null;
        if ($request->file('file_path') instanceof UploadedFile) {
            // Upload the file and get the file path
            $filePath = $this->uploadFile($request->file('file_path'), 'uploads/files');
        }

        CommentReply::create([
            'user_id' => $userId,
            'task_comment_id' => $id,
            'content' => $request->content,
            'file_path' => $filePath
        ]);

        return back()->with('success', 'Reply added successfully');
    }
}

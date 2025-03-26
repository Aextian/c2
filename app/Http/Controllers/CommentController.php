<?php

namespace App\Http\Controllers;

use App\Events\NotificationReceived;
use App\Events\NotificationSent;
use App\FileUpload;
use App\Models\CommentReply;
use App\Models\TaskComment;
use App\Services\NotificationService;
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

            $content = 'commented on your task';

            ((new NotificationService())->sendNotification($content, $request->subTaskId));

            $userId = Auth::id();
            TaskComment::create([
                'user_id' => $userId,
                'sub_task_id' => $request->subTaskId,
                'comment' => $request->comment,
                'file_path' => $filePath
            ]);

            return response()->json(['message' => 'Comment added successfully'], 200);
            // return back()->with('success', 'Reply added successfully');

            // return redirect()->back()->with('success', 'Comment added successfully');
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function updateComment(Request $request, $id)
    {

        $request->validate([
            'comment' => 'required',
        ]);

        try {

            TaskComment::find($id)->update([
                'comment' => $request->comment,
            ]);

            // return response()->json(['message' => 'Comment added successfully'], 200);
            return redirect()->back()->with('success', 'Comment updated successfully');
        } catch (\Throwable $th) {
            // throw $th;
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }
    public function deleteComment($id)
    {

        TaskComment::find($id)->delete();

        return redirect()->back()->with('success', 'Comment deleted successfully');
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
        $content = 'replied on your comment';

        $comment = TaskComment::find($id);

        ((new NotificationService())->sendNotification($content, $comment->sub_task_id));


        CommentReply::create([
            'user_id' => $userId,
            'task_comment_id' => $id,
            'content' => $request->content,
            'file_path' => $filePath
        ]);

        return back()->with('success', 'Reply added successfully');
    }

    public function updateReplyComment(Request $request, $id)
    {

        $request->validate([
            'comment' => 'required',
        ]);

        try {

            CommentReply::find($id)->update([
                'content' => $request->comment,
            ]);

            // return response()->json(['message' => 'Comment added successfully'], 200);
            return redirect()->back()->with('success', 'Comment updated successfully');
        } catch (\Throwable $th) {
            // throw $th;
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }

    public function deleteReplyComment($id)
    {

        CommentReply::find($id)->delete();

        return redirect()->back()->with('success', 'Reply deleted successfully');
    }
}

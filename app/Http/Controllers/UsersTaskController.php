<?php

namespace App\Http\Controllers;

use App\Models\CordinatorSubTask;
use App\Models\TaskComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UsersTaskController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        return inertia('users-tasks/index', [
            'cordinator_tasks' => CordinatorSubTask::query()
                ->where('user_id', $userId)
                ->with('subTask.task', 'subTask.comments.user')
                ->get()
        ]);
    }

    public function storeComment(Request $request)
    {
        $request->validate([
            'subTaskId' => 'required',
            'comment' => 'required',
        ]);
        try {
            $userId = Auth::id();

            TaskComment::create([
                'user_id' => $userId,
                'sub_task_id' => $request->subTaskId,
                'comment' => $request->comment,
                'file_path' => $request->filePath
            ]);
            // return response()->json(['message' => 'Comment added successfully'], 200);
            return redirect()->back()->with('success', 'Comment added successfully');
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}

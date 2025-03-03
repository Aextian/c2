<?php

namespace App\Http\Controllers;

use App\Models\CordinatorSubTask;
use App\Models\CordinatorTask;
use App\Models\SubTask;
use App\Models\TaskComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpParser\Node\Stmt\TryCatch;

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

    public function show(string $id)
    {
        return inertia('users-tasks/show', [
            'id' => $id
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required',
        ]);
        try {
            CordinatorSubTask::find($id)->update(['status' => $request->status]);

            return response()->json(['message' => 'Status updated successfully'], 200);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function getCordinatorTasks()
    {
        $userId = Auth::id();

        $cordinator_tasks = CordinatorSubTask::query()
            ->where('user_id', $userId)
            ->with('subTask.task', 'subTask.comments.user')
            ->get();

        return response()->json($cordinator_tasks);
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

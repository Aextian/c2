<?php

namespace App\Http\Controllers;

use App\Models\CordinatorSubTask;
use App\Models\CordinatorTask;
use App\Models\SubTask;
use App\Models\Task;
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
            $cordinatorSubTask =  CordinatorSubTask::find($id);
            $cordinatorSubTask->update(['status' => $request->status]);
            $subTask = SubTask::with('cordinatorSubTasks')->find($cordinatorSubTask->sub_task_id);
            $subTaskPercentage = $subTask->percentage;
            $totalCordinatorPercentage = $subTask->cordinatorSubTasks()->where('status', 'done')->sum('percentage');

            // check if task is doing
            $taskDoing = $subTask->cordinatorSubTasks()->where('status', 'doing')->exists();

            $task = Task::with('subTasks')->find($subTask->task_id);

            if ($taskDoing) {
                $task->update(['status' => 'doing']);
            } else {
                $task->update(['status' => 'todo']);
            }

            // update subtask status
            if ($subTaskPercentage == $totalCordinatorPercentage) {
                $subTask->update(['is_completed' => true]);

                // update task status
                $taskPercentage = $task->subTasks()->where('is_completed', true)->sum('percentage');

                if ($taskPercentage == $task->percentage) {
                    $task->update(['status' => 'done']);
                }
            };

            return response()->json(['message' => 'Status updated successfully'], 200);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function getCordinatorTasks()
    {
        $user = auth()->user();
        $isCordinator = $user->can('coordinator-dashboard');
        if ($isCordinator) {
            $cordinator_tasks = CordinatorSubTask::query()
                ->where('user_id', $user->id)
                ->with('subTask.task', 'subTask.comments.user', 'subTask.comments.replies.user')
                ->get();
        } else {
            $cordinator_tasks = CordinatorSubTask::query()
                ->with('subTask.task', 'subTask.comments.user', 'subTask.comments.replies.user')
                ->get();
        }

        return response()->json($cordinator_tasks);
    }
}

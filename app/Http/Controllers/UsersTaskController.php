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

            // check this cordinatorSubTasks is doing base on subtask
            $taskDoing = $subTask->cordinatorSubTasks()
                ->whereIn('status', ['doing', 'done'])
                ->exists();

            //find the main task using the subtask
            $task = Task::with('subTasks')->find($subTask->task_id);

            // check all cordinatorSubTasks is doing
            $taskExists = $task->subTasks()
                ->whereHas('cordinatorSubTasks', function ($query) {
                    $query->whereIn('status', ['doing', 'done']);
                })
                ->exists();

            if ($taskDoing || $taskExists) {
                $task->update(['status' => 'doing']);
            } else {
                $task->update(['status' => 'todo']);
            }

            $subTask->update(['is_completed' => false]); //reset the subtask status

            //check if all cordinatorSubTasks is done
            if ($subTaskPercentage == $totalCordinatorPercentage) {
                $subTask->update(['is_completed' => true]);

                // update task status
                $taskPercentage = $task->subTasks()->where('is_completed', true)->sum('percentage');

                // check if all subtasks is done and update task status
                if ($taskPercentage == $task->percentage) {
                    $task->update(['status' => 'done']);
                }
            };

            return response()->json(['message' => 'Status updated successfully'], 200);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function getCordinatorTasks(string $id)
    {
        $user = auth()->user();
        $isCordinator = $user->can('coordinator-dashboard');
        $subtTaskIds = SubTask::where('task_id', $id)->pluck('id')->toArray();
        if ($isCordinator) {
            $cordinator_tasks = CordinatorSubTask::query()
                ->whereIn('sub_task_id', $subtTaskIds)
                ->where('user_id', $user->id)
                ->with('subTask.task', 'subTask.comments.user', 'subTask.comments.replies.user')
                ->get();
        } else {
            $cordinator_tasks = CordinatorSubTask::query()
                ->whereIn('sub_task_id', $subtTaskIds)
                ->with('subTask.task', 'subTask.comments.user', 'subTask.comments.replies.user')
                ->get();
        }

        return response()->json($cordinator_tasks);
    }
}

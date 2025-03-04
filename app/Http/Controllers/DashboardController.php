<?php

namespace App\Http\Controllers;

use App\Models\CordinatorSubTask;
use App\Models\SubTask;
use App\Models\Task;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $user = auth()->user();
        $isCordinator = $user->can('cordinator-dashbord');
        if ($isCordinator) {
            return inertia('dashboard', [
                'tasks' => Task::all(),
            ]);
        } else {
            $cordinatorSubTasksIds = CordinatorSubTask::where('user_id', $user->id)->pluck('sub_task_id')->toArray(); // Get the subtask ids
            $taskIds = SubTask::whereIn('id', $cordinatorSubTasksIds)->pluck('task_id')->toArray(); // Get the task ids
            $tasks = Task::whereIn('id', $taskIds)->get();
            return inertia('dashboard', [
                'tasks' => $tasks
            ]);
        }
    }
}

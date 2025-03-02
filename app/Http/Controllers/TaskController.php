<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Models\CordinatorSubTask;
use App\Models\CordinatorTask;
use App\Models\SubTask;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('tasks/index', [
            'users' => User::get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TaskRequest $request)
    {
        try {
            DB::transaction(function () use ($request) {

                $userId = Auth::id();
                $options = $request->input('options');
                $cordinatorSubTasks = [];
                $cordinatorTask = [];

                $task =  Task::create([
                    'user_id'   => $userId,
                    'title' => $request->input('title'),
                    'content' => $request->input('content'),
                    'type' => $request->input('type'),
                    'dead_line' => $request->input('deadLine'),
                ]);

                foreach ($options as $option) {

                    $subTask = SubTask::create([
                        'task_id' => $task->id,
                        'content' => $option['subTask']
                    ]);

                    foreach ($option['userIds'] as $userId) {
                        $cordinatorTask[] = [
                            'user_id' => $userId,
                            'task_id' => $task->id
                        ];
                        $cordinatorSubTasks[] = [
                            'sub_task_id' => $subTask->id,
                            'user_id' => $userId,
                            'created_at' => now(),
                            'updated_at' => now()
                        ];
                    }
                }

                // Bulk insert all coordinator tasks at once
                if (!empty($cordinatorTask)) {
                    CordinatorTask::insert($cordinatorTask);
                }

                if (!empty($cordinatorSubTasks)) {
                    CordinatorSubTask::insert($cordinatorSubTasks);
                }
                return redirect()->route('tasks.index')->with('success', 'Task created successfully');
            });
        } catch (\Throwable $th) {
            // throw $th;
            return redirect()->route('tasks.index')->with('error', 'Something went wrong');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

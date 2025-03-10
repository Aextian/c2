<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Models\CordinatorSubTask;
use App\Models\CordinatorTask;
use App\Models\SubTask;
use App\Models\Task;
use App\Models\User;
use App\Services\NotificationService;
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
        $user = auth()->user();
        $allowed = $user->canAny(['task-edit', 'task-delete', 'task-create']);
        if (!$allowed) {
            return back()->with('error', 'You do not have permission to view tasks page.');
        }

        return inertia('tasks/index', [
            'tasks' => Task::with('cordinatorTasks.user')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();
        $notAllowed = $user->can('task-create');
        if (!$notAllowed) {
            return back()->with('error', 'You do not have permission to create tasks.');
        }
        return inertia('tasks/create', [
            'users' => User::get(),
        ]);
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
                $cordinatorTasks = [];
                $uniqueTasks = []; // Initialize an array to track added user IDs

                $task =  Task::create([
                    'user_id'   => $userId,
                    'title' => $request->input('title'),
                    'content' => $request->input('content'),
                    'type' => $request->input('type'),
                    'dead_line' => $request->input('deadLine'),
                    'percentage' => 100
                ]);


                $percentage =  100 / count($options);

                foreach ($options as $option) {

                    $subTask = SubTask::create([
                        'task_id' => $task->id,
                        'content' => $option['subTask'],
                        'percentage' => $percentage
                    ]);

                    $subPercentage =   $percentage / count($option['userIds']);

                    foreach ($option['userIds'] as $userId) {

                        // Prevent duplicate user_id-task_id pairs in $cordinatorTasks
                        if (!isset($uniqueTasks[$userId])) {
                            $cordinatorTasks[] = [
                                'user_id' => $userId,
                                'task_id' => $task->id,
                            ];
                            $uniqueTasks[$userId] = true; // Mark user_id as added
                        }

                        $cordinatorSubTasks[] = [
                            'sub_task_id' => $subTask->id,
                            'user_id' => $userId,
                            'percentage' => $subPercentage,
                            'created_at' => now(),
                            'updated_at' => now()
                        ];
                    }
                }

                if (!empty($cordinatorSubTasks)) {
                    CordinatorSubTask::insert($cordinatorSubTasks);
                }

                if (!empty($cordinatorSubTasks)) {
                    CordinatorTask::insert($cordinatorTasks);
                }
                // Now, fetch users related to the sub-task (since they exist in the database)

                foreach ($options as $option) {
                    $subTask = SubTask::where('task_id', $task->id)
                        ->where('content', $option['subTask']) // Ensure the correct sub-task
                        ->first();
                    if ($subTask) {
                        $content = 'assigned new task';
                        ((new NotificationService())->sendNotification($content, $subTask->id));
                    }
                }

                return redirect()->route('tasks.index')->with('success', 'Task created successfully');
            });
        } catch (\Throwable $th) {
            throw $th;
            // return redirect()->route('tasks.index')->with('error', 'Something went wrong');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return inertia('tasks/show', [
            'id' => $id
        ]);
    }

    public function getTask(string $id)
    {

        $task = Task::with('subTasks.comments.user', 'subTasks.task')->find($id);

        return response()->json($task);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = auth()->user();
        $notAllowed = $user->can('task-edit');
        if (!$notAllowed) {
            return back()->with('error', 'You do not have permission to edit tasks.');
        }
        return inertia('tasks/edit', [
            'task' => Task::with('subTasks.task', 'subTasks.cordinatorSubTasks')->find($id),
            'users' => User::get(),

        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TaskRequest $request, string $id)
    {
        try {

            DB::transaction(function () use ($request, $id) {
                $options = $request->input('options');
                $cordinatorTasks = [];
                $uniqueTasks = []; // Initialize an array to track added user IDs
                $subTaskIds = [];
                $cordinatorSubTaskIds = [];

                $task = Task::with('subTasks')->find($id);

                $task->update([
                    'title' => $request->input('title'),
                    'content' => $request->input('content'),
                    'type' => $request->input('type'),
                    'dead_line' => $request->input('deadLine'),
                ]);

                // get the percentage each subtask
                $percentage =  100 / count($options);


                CordinatorTask::where('task_id', $id)->delete(); // Delete previous cordinator tasks

                foreach ($options as $option) {

                    $subTask = SubTask::with('cordinatorSubTasks')->updateOrCreate(
                        [
                            'id' => $option['id'] ?? null,
                        ],
                        [
                            'task_id' => $task->id,
                            'content' => $option['subTask'],
                            'percentage' => $percentage
                        ]
                    );


                    $subTaskIds[] = $subTask->id;
                    $subPercentage =   $percentage / count($option['userIds']);

                    foreach ($option['userIds'] as $userId) {

                        $coordinatorSubTask =  CordinatorSubTask::firstOrCreate(
                            [
                                'user_id' => $userId,
                                'sub_task_id' => $subTask->id,
                            ],
                            [
                                'percentage' => $subPercentage,
                            ]
                        );

                        if ($coordinatorSubTask) {
                            $cordinatorSubTaskIds[] = $coordinatorSubTask->id;
                            $coordinatorSubTask->update([
                                'sub_task_id' => $subTask->id,
                                'user_id' => $userId,
                                'percentage' => $subPercentage,
                            ]);
                        }

                        // Prevent duplicate user_id-task_id pairs in $cordinatorTasks
                        if (!isset($uniqueTasks[$userId])) {
                            $cordinatorTasks[] = [
                                'user_id' => $userId,
                                'task_id' => $id
                            ];
                            $uniqueTasks[$userId] = true; // Mark user_id as added
                        }
                    }

                    $subTask->cordinatorSubTasks()->whereNotIn('id', $cordinatorSubTaskIds)->delete(); // Delete the remaining cordinator sub tasks
                }

                $task->subTasks()->whereNotIn('id', $subTaskIds)->delete(); //  Delete the remaining sub tasks

                if (!empty($cordinatorTasks)) {
                    CordinatorTask::insert($cordinatorTasks);
                }
            });

            return redirect()->route('tasks.index')->with('success', 'Task updated successfully');
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = auth()->user();
        $notAllowed = $user->can('task-delete');
        if (!$notAllowed) {
            return back()->with('error', 'You do not have permission to edit tasks.');
        }

        Task::find($id)->delete();

        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully');
    }
}

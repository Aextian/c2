<?php

namespace App\Http\Controllers;

use App\Models\CordinatorSubTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UsersTaskController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        return inertia('users-tasks/index', [
            'cordinator_tasks' => CordinatorSubTask::where('user_id', $userId)->with('subTask')->get()
        ]);
    }
}

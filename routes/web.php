<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OpenAIController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UsersTaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware('auth')->group(function () {

    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::get('/notifications', NotificationController::class); // Route for generating sub-tasks

    Route::post('/openai/generate-subtasks', OpenAIController::class); // Route for generating sub-tasks

    Route::resource('users', UserController::class);
    Route::resource('tasks', TaskController::class);
    Route::resource('permissions', PermissionController::class);

    // cordinator tasks
    Route::prefix('users-tasks')->group(function () {
        Route::get('/', [UsersTaskController::class, 'index'])->name('users-tasks.index');

        Route::post('/comment', [CommentController::class, 'storeComment'])->name('users-tasks.comment');
        Route::post('/reply-comment/{id}', [CommentController::class, 'storeReply'])->name('reply-comment.store');

        // download file
        Route::get('/download', [FileController::class, 'downloadFile'])->name('download');


        Route::get('/cordinator-tasks/{id}', [UsersTaskController::class, 'getCordinatorTasks'])->name('users-tasks.cordinator-tasks');
        Route::get('/cordinator-tasks', [UsersTaskController::class, 'getAllCordinatorTasks'])->name('user-tasks');

        Route::get('/view-task/{id}', [UsersTaskController::class, 'show'])->name('users-tasks.show');

        Route::get('/show-task/{id}', [UsersTaskController::class, 'showTaskInNotifications'])->name('users-task.show');

        Route::post('/update-status/{id}', [UsersTaskController::class, 'updateStatus'])->name('users-tasks.update-status');
    });

    // tasks
    Route::get('/get-task/{id}', [TaskController::class, 'getTask'])->name('get-task');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

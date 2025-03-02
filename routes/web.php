<?php

use App\Http\Controllers\OpenAIController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UsersTaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::post('/openai/generate-subtasks', OpenAIController::class); // Route for generating sub-tasks

    Route::resource('users', UserController::class);
    Route::resource('tasks', TaskController::class);
    Route::resource('permissions', PermissionController::class);

    // cordinator tasks
    Route::prefix('users-tasks')->group(function () {
        Route::get('/', [UsersTaskController::class, 'index'])->name('users-tasks.index');
        Route::post('/comment', [UsersTaskController::class, 'storeComment'])->name('users-tasks.comment');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

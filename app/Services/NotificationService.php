<?php

namespace App\Services;

use App\Models\CordinatorSubTask;
use App\Models\Notification;
use App\Models\SubTask;
use Illuminate\Support\Facades\Auth;

class NotificationService
{

    public function sendNotification($content, $subTaskId)
    {
        $subTask = SubTask::find($subTaskId);

        $userIds = $subTask->cordinatorSubTasks()->pluck('user_id')->toArray();

        $mainContent = auth()->user()->name . ' ' . $content;

        $notifications = collect($userIds)->map(fn($userId) => [
            'from_user_id' => Auth::id(),
            'to_user_id' => $userId,
            'content' => $mainContent,
            'sub_task_id' => $subTaskId,
            'created_at' => now(),
            'updated_at' => now()
        ])->toArray();

        Notification::insert($notifications);
    }

    public function getNotifications()
    {
        $userId = Auth::id();

        $notifications = Notification::where('to_user_id', $userId)->orderBy('created_at', 'desc')->get();

        return $notifications;
    }
}

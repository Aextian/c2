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


        $authId = Auth::id();

        $notifications = collect($userIds)
            ->filter(fn($userId) => $userId !== $authId) // Skip if userId is the same as authId
            ->map(fn($userId) => [
                'from_user_id' => $authId,
                'to_user_id' => $userId,
                'content' => $content,
                'sub_task_id' => $subTaskId,
                'created_at' => now(),
                'updated_at' => now()
            ])
            ->toArray();

        Notification::insert($notifications);
    }

    public function getNotifications()
    {
        $userId = Auth::id();

        $notifications = Notification::with('fromUser')->where('to_user_id', $userId)->latest()->take(6)->get();

        return $notifications;
    }
}

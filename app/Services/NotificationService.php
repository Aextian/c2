<?php

namespace App\Services;

use App\Events\NotificationReceived;
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

        foreach ($userIds as $userId) {
            broadcast(new NotificationReceived(Auth::user(), $content, $userId));
        }

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

        $notifications = Notification::where('is_read', false)->with('fromUser')->where('to_user_id', $userId)->latest()->get();

        return $notifications;
    }

    public function markAsRead(string $notificationId)
    {
        $userId = Auth::id();
        $notifications = Notification::where('to_user_id', $userId)->update(['is_read' => true]);
        return $notifications;
    }
}

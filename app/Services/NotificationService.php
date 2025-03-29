<?php

namespace App\Services;

use App\Events\NotificationReceived;
use App\Models\CordinatorSubTask;
use App\Models\Notification;
use App\Models\SubTask;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class NotificationService
{

    public function sendNotification($content, $subTaskId)
    {
        $subTask = SubTask::find($subTaskId);

        $adminId = 2;

        $userIds = $subTask->cordinatorSubTasks()->pluck('user_id')->toArray();

        $userIds = array_filter(array_unique(array_merge([$adminId], $userIds)));

        $authId = Auth::id();
        $now = now();

        $adminMessage = 'commented on their assigned task.';

        $notifications = collect($userIds)
            ->filter(fn($userId) => $userId !== $authId) // Skip if userId is the same as authId
            ->map(fn($userId) => [
                'from_user_id' => $authId,
                'to_user_id' => $userId,
                'content' =>  $adminId == $userId ? $adminMessage : $content,
                'sub_task_id' => $subTaskId,
                'created_at' => $now,
                'updated_at' => $now
            ])
            ->toArray();

        Notification::insert($notifications);

        // Fetch the inserted notifications
        $notifications = Notification::query()
            ->with('fromUser')
            ->where('from_user_id', $authId)
            ->whereIn('to_user_id', $userIds)
            ->where('sub_task_id', $subTaskId)
            // Ensure we get only newly inserted data
            ->where('created_at', $now)
            ->where('updated_at', $now)
            ->get();

        // Broadcast notifications
        foreach ($notifications as $notification) {
            broadcast(new NotificationReceived(Auth::user(), $notification, $notification->to_user_id));
        }
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

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CordinatorSubTask extends Model
{
    protected $casts = [
        'percentage' => 'float',
    ];

    protected $fillable = [
        'user_id',
        'sub_task_id',
        'percentage',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function coordinatorDoneTasks(): int
    {
        if (!$this->sub_task_id) {
            return 0;
        }
        return SubTask::whereHas('cordinatorSubTasks', function ($query) {
            $query->where('sub_task_id', $this->sub_task_id)
                ->where('status', 'done');
        })->count();
    }

    protected $appends = ['done_tasks_count'];

    public function getDoneTasksCountAttribute()
    {
        return $this->coordinatorDoneTasks();
    }



    public function subTask(): BelongsTo
    {
        return $this->belongsTo(SubTask::class);
    }
}

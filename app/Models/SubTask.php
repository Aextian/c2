<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubTask extends Model
{
    protected $fillable = [
        'task_id',
        'content',
        'is_completed',
        'percentage',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
    public function cordinatorSubTasks(): HasMany
    {
        return $this->hasMany(CordinatorSubTask::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(TaskComment::class);
    }
}

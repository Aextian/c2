<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CordinatorSubTask extends Model
{
    protected $fillable = [
        'user_id',
        'sub_task_id',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subTask(): BelongsTo
    {
        return $this->belongsTo(SubTask::class);
    }
}

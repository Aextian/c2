<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CordinatorTask extends Model
{
    protected $fillable = [
        'task_id',
        'user_id',
        'status',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

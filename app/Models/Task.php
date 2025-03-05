<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{

    protected $casts = [
        'percentage' => 'float',
        'is_completed' => 'boolean',
    ];

    protected $appends = ['progress'];

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'type',
        'dead_line',
        'percentage',
        'status',
    ];
    public function cordinatorTasks(): HasMany
    {
        return $this->hasMany(CordinatorTask::class);
    }

    public function subTasks(): HasMany
    {
        return $this->hasMany(SubTask::class);
    }

    public function getProgressAttribute(): float
    {
        return (float) $this->subTasks()->where('is_completed', true)->sum('percentage');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{


    protected $fillable = [
        'user_id',
        'title',
        'content',
        'type',
        'dead_line',
        'percentage',
    ];
    public function cordinatorTasks(): HasMany
    {
        return $this->hasMany(CordinatorTask::class);
    }

    public function subTasks(): HasMany
    {
        return $this->hasMany(SubTask::class);
    }
}

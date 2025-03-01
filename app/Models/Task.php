<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}

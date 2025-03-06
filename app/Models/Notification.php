<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{

    protected $fillable = [
        'from_user_id',
        'to_user_id',
        'content',
        'sub_task_id',
        'is_read',
    ];
}

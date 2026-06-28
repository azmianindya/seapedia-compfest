<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = ['reviewer_name','rating','comment','user_id'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
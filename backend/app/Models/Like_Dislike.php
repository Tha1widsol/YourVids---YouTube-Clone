<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like_Dislike extends Model
{
    use HasFactory;
    protected $table = 'likes_dislikes';
    protected $fillable = ['channel_id', 'video_id', 'liked', 'disliked'];
}

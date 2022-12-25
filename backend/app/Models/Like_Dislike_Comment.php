<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like_Dislike_Comment extends Model
{
    use HasFactory;
    protected $table = 'likes_dislikes_comments';
    protected $fillable = ['channel_id', 'comment_id', 'liked', 'disliked'];

    public function channel(){
        return $this->belongsTo('App\Models\Channel');
    }

    public function comments(){
        return $this->hasMany('App\Models\Comment', 'channel_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;
    protected $table = 'comments';
    protected $fillable = ['likes', 'dislikes'];

    public function channel(){
        return $this->belongsTo('App\Models\Channel');
    }

    public function video(){
        return $this->belongsTo('App\Models\Video');
    }

    public function replies(){
        return $this->hasMany('App\Models\Reply', 'replyTo_id', 'reply_id');
    }

}

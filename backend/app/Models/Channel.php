<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    use HasFactory;
    protected $table = 'channels';


    public function channels(){
        return $this->hasMany('App\User');
    }
    
    public function subscribing() {
        return $this->belongsToMany(Channel::class, 'subscriptions', 'subscriber_id', 'subscribing_id')->withTimestamps();
    }
    
    public function subscribers() {
        return $this->belongsToMany(channel::class, 'subscriptions', 'subscribing_id', 'subscriber_id')->withTimestamps();
    }

    public function videos(){
        return $this->hasMany('App\Models\Video', 'channel_id');
    }

    public function likedVideos(){
        return $this->hasMany('App\Models\Like_Dislike', 'channel_id');
    }

    public function playlists(){
        return $this->hasMany('App\Models\Playlist', 'channel_id');
    }

    public function comments(){
        return $this->hasMany('App\Models\Comment','channel_id');
    }

    public function likedDislikedComments(){
        return $this->hasMany('App\Models\Like_Dislike_Comment','channel_id');
    }


}

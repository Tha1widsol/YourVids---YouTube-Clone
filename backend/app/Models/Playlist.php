<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    use HasFactory;
    protected $table = 'playlists';
    protected $fillable = ['id'];

    public function playlist() {
        return $this->belongsToMany('App\Models\Video', 'playlist_videos', 'playlist_id', 'video_id')->withTimestamps();
    }

    public function channel(){
        return $this->belongsTo('App\Models\Channel');
    }

    public function videos(){
        return $this->belongsToMany('App\Models\Video', 'playlist_videos', 'playlist_id', 'video_id');
    }

}

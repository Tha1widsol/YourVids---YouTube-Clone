<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;
    protected $table = 'videos';
    protected $fillable = ['likes', 'dislikes'];

    public function channel(){
        return $this->belongsTo('App\Models\Channel');
    }

    public function comments(){
        return $this->hasMany('App\Models\Comment', 'video_id')->whereNull('parent_id');
    }

}

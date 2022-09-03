<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    use HasFactory;
    protected $table = 'channels';
    protected $primaryKey = 'channel_id';

    public function channels(){
        return $this->hasMany('App\User');
    }
    
    public function subscribers() {
        return $this->belongsToMany(channel::class, 'subscriptions', 'subscribing_id', 'subscriber_id');
    }

    public function subscribing() {
        return $this->belongsToMany(Channel::class, 'subscriptions', 'subscriber_id', 'subscribing_id');
    }

}

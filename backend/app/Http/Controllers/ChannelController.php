<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth, DB;
use App\Models\Channel;

class ChannelController extends Controller
{
    public function createChannel(Request $request){
        $user = Auth::user();
        $channel = new Channel;
     
        $channel->name = $request->name;
        $channel->description = $request->description;
        $channel->logo = $request->logo;
        $channel->banner = $request->banner;
        $channel->user_id = $user->id;
        $channel->save();
        $cuser = DB::table('channels')->where('user_id', $user->id)->get();

        return response([
            'message' => 'Channel is created'
        ]);
    }

    public function getChannel(Request $request){
        $lookup_url_kwarg = 'id';
        $id = $request->$lookup_url_kwarg;
        $channel = DB::table('channels')->where('id', $id)->first();
        if (!$channel) throw new \ErrorException();
        return $channel;
    }

    public function getUserChannels(Request $request){
        $user = Auth::user();
        $channels = DB::table('channels')->where('user_id', $user->id)->get();
        return $channels;
    }

}
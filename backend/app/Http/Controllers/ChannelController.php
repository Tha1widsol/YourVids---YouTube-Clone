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

}
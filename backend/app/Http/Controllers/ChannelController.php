<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth, DB;
use App\Models\Channel;
use App\Models\Subscription;

class ChannelController extends Controller
{
    public function createChannel(Request $request){
        $user = Auth::user();
        $channel = new Channel;
     
        $channel->name = $request->name;
        $channel->description = $request->description;

        if ($request->hasFile('logo')){
            $logo = $request->file('logo');
            $logoName = $logo->getClientOriginalName();
            $finalName = date('His') . $logoName;
            $pathName = $logo->storeAs('logos/', $finalName, 'public');
            $channel->logo = $pathName;
        }

        if ($request->hasFile('banner')){
            $banner = $request->file('banner');
            $bannerName = $banner->getClientOriginalName();
            $finalName = date('His') . $bannerName;
            $pathName = $banner->storeAs('banners/', $finalName, 'public');
            $channel->banner = $pathName;
        }
        DB::table('channels')->where('active', true)->update(['active' => null]);
        $channel->user_id = $user->id;
        $channel->active = true;
        $channel->save();

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
        $channels = DB::table('channels')->where('user_id', $user->id)->where('active', null)->get();
        return $channels;
    }

    public function getCurrentChannel(){
        $channel = DB::table('channels')->where('active', true)->first();
        return $channel;
    }

    public function switchChannel(Request $request){
        $lookup_url_kwarg = 'id';
        $channel_id = $request->$lookup_url_kwarg;
        DB::table('channels')->where('active', true)->update(['active' => null]);
        DB::table('channels')->where('id', $channel_id)->update(['active' => true]);
    }

    public function subscribe(Request $request){
        $lookup_url_kwarg = 'id';
        $channel_id = $request->$lookup_url_kwarg;
        $user = Auth::user();
        $userChannel = DB::table('channels')->where('user_id', $user->id)->where('active', true)->first();
        $channel = DB::table('channels')->where('id', $channel_id)->first();
        $newSubscription = new Subscription;
        $newSubscription->subscriber_id = $channel->id;
        $newSubscription->subscribing_id = $userChannel->id;
        $newSubscription->save();
        $subCount = $channel->subscribers + 1;
        DB::table('channels')->where('id', $channel_id)->update(['subscribers' => $subCount]);
    }

}      
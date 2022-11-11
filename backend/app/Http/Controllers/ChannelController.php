<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Channel;
use App\Models\Subscription;
use App\Models\Playlist;

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
        Channel::where('active', true)->update(['active' => null]);
        $channel->user_id = $user->id;
        $channel->active = true;
        $channel->save();
        $savedPlaylist = new Playlist;
        $savedPlaylist->title = "Saved";
        $savedPlaylist->visibility = "Private";
        $channel->playlists()->save($playlist);
        $savedPlaylist->save();
        
        return response([
            'message' => 'Channel is created'
        ]);
    }

    public function getChannel(Request $request){
        $lookup_url_kwarg = 'id';
        $id = $request->$lookup_url_kwarg;
        $channel = Channel::where('id', $id)->first();
        if (!$channel) throw new \ErrorException();
        return $channel;
    }

    public function getUserChannels(Request $request){
        $user = Auth::user();
        $channels = Channel::where('user_id', $user->id)->where('active', null)->get();
        return $channels;
    }

    public function getCurrentChannel(){
        $channel = Channel::where('active', true)->first();
        return $channel;
    }

    public function switchChannel(Request $request){
        $lookup_url_kwarg = 'id';
        $channel_id = $request->$lookup_url_kwarg;
        Channel::where('active', true)->update(['active' => null]);
        Channel::where('id', $channel_id)->update(['active' => true]);
    }

    public function subscribe(Request $request){
        $lookup_url_kwarg = 'id';
        $channel_id = $request->$lookup_url_kwarg;
        $user = Auth::user();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        $channel = Channel::where('id', $channel_id)->first();
        $userChannel->subscribing()->attach($channel);
        $subCount = $channel->subscribers + 1;
        Channel::where('id', $channel_id)->update(['subscribers' => $subCount]);
    }

    public function unsubscribe(Request $request){
        $lookup_url_kwarg = 'id';
        $channel_id = $request->$lookup_url_kwarg;
        $user = Auth::user();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        $channel = Channel::where('id', $channel_id)->first();
        $userChannel->subscribing()->detach($channel);
        $subCount = $channel->subscribers - 1;
        Channel::where('id', $channel_id)->update(['subscribers' => $subCount]);
    }

    public function getSubscribers(Request $request){
        $lookup_url_kwarg = 'id';
        $channel_id = $request->$lookup_url_kwarg;
        $channel = Channel::where('id', $channel_id)->first();
        if (!$channel) throw new \ErrorException();
        $subscribers = $channel->subscribers()->get();
        return $subscribers;
    }

    public function checkSubscribed(Request $request){
        $subscribed = false;
        $lookup_url_kwarg = 'id';
        $channel_id = $request->$lookup_url_kwarg;
        $user = Auth::user();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        $subscription = Subscription::where('subscribing_id', $channel_id)->where('subscriber_id', $userChannel->id)->first();
        if ($subscription) $subscribed = true;
        return response([
            'subscribed' => $subscribed
        ]);
    }

}      
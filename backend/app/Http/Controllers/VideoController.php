<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth, DB, Storage;
use App\Models\Video;
use App\Models\Channel;
use App\Models\Subscription;

class VideoController extends Controller
{
    public function createVideo(Request $request){
        $lookup_url_kwarg = 'id';
        $channel_id = $request->$lookup_url_kwarg;
        $video = new Video;

        $video->title = $request->title;
        $video->description = $request->description;
        $video->category = $request->category;

        if ($request->hasFile('thumbnail')){
            $thumbnail = $request->file('thumbnail');
            $thumbnailName = $thumbnail->getClientOriginalName();
            $finalName = date('His') . $thumbnailName;
            $pathName = $thumbnail->storeAs('thumbnails/', $finalName, 'public');
            $video->thumbnail = $pathName;
        }

        if ($request->hasFile('video')){
            $fileName = $request->video->getClientOriginalName();
            $filePath = 'videos/' . $fileName;
            $isFileUploaded = Storage::disk('public')->put($filePath, file_get_contents($request->video));
            $video->pathName = $filePath;
        }

        $video->length = $request->length;

        $channel = Channel::where('id', $channel_id)->first();
        $channel->videos()->save($video);
        $video->save();

        return response([
            'message' => 'Video is created on this channel'
        ]);

    }

    public function getVideo(Request $request){
        $lookup_url_kwarg = 'id';
        $video_id = $request->$lookup_url_kwarg;
        $video = Video::with('channel')->where('id', $video_id)->first();
        if (!$video) throw new \ErrorException;
        return $video;
    }

    public function getChannelVideos(Request $request){
        $lookup_url_kwarg = 'id';
        $channel_id = $request->$lookup_url_kwarg;
        $channel = Channel::where('id', $channel_id)->first();
        $videos = Video::with('channel')->where('channel_id', $channel_id)->get();
        return $videos;
    }

    public function getHomeVideos(){
        $videos = Video::with('channel')->get();
        if (!$videos) throw new \ErrorException;
        return $videos;
    }

    public function getSubscriptionVideos(){
        $videos = collect();
        $user = Auth::user();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        $channels = $userChannel->subscribing()->get();
        foreach ($channels as $channel){
            $subscriptions = Subscription::where('subscriber_id', $userChannel->id)->get();
            foreach ($subscriptions as $subscription){
                $channelVideos = Video::with('channel')->where('channel_id', $channel->id)->whereDate('created_at','>=',$subscription->created_at)->get();
                foreach ($channelVideos as $video){
                    $videos->push($video);
                 }
            }
        }
        
        return $videos;
    }


}

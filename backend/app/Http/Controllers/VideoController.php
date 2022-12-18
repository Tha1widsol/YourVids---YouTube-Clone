<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth, DB, Storage;
use App\Models\Video;
use App\Models\Channel;
use App\Models\Subscription;
use App\Models\Like_Dislike;

function refreshLikesDislikes($video_id){
    $likes = Like_Dislike::where('video_id', $video_id)->where('liked', true)->get();
    $likesCount = $likes->count();
    $dislikes = Like_Dislike::where('video_id', $video_id)->where('disliked', true)->get();
    $dislikesCount = $dislikes->count();
    Video::where('id', $video_id)->update(['likes' => $likesCount, 'dislikes' => $dislikesCount]);
}

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
        refreshLikesDislikes($video_id);
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

    public function incrementViews(Request $request){
      $lookup_url_kwarg = 'id';
      $video_id = $request->$lookup_url_kwarg;
      $video = Video::find($video_id);
      $video->views++;
      $video->save();
    }

    public function likeVideo(Request $request){
        $lookup_url_kwarg = 'id';
        $video_id = $request->$lookup_url_kwarg;
        $user = Auth::user();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        Like_Dislike::updateOrCreate(
            ['channel_id' => $userChannel->id, 'video_id' => $video_id,], ['liked' => true, 'disliked' => false]
        );
    }

    public function dislikeVideo(Request $request){
        $lookup_url_kwarg = 'id';
        $video_id = $request->$lookup_url_kwarg;
        $user = Auth::user();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        Like_Dislike::updateOrCreate(
            ['channel_id' => $userChannel->id, 'video_id' => $video_id], ['liked' => false, 'disliked' => true]
        );
    }

    public function removeLikeDislike(Request $request){
        $lookup_url_kwarg = 'id';
        $video_id = $request->$lookup_url_kwarg;
        $user = Auth::user();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        Like_Dislike::where('channel_id', $userChannel->id) ->where('video_id','=',$video_id)->delete();
    }

    public function getLikedVideos(Request $request){
        $lookup_url_kwarg = 'id';
        $channel_id = $request->$lookup_url_kwarg;
        $channel = Channel::where('id', $channel_id)->first();
        $videos = Like_Dislike::with('channel')->with('videos')->where('channel_id', $channel_id)->where('liked', true)->get();
        if (!$channel || !$videos) throw new \ErrorException;
        return $videos;
    }

    public function checkLikedVideo(Request $request){
        $lookup_url_kwarg = 'id';
        $video_id = $request->$lookup_url_kwarg;
        $user = Auth::user();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        $likedVideo = Like_Dislike::where('video_id', $video_id)->where('channel_id', $userChannel->id)->first();
        if ($likedVideo){
            return response([
                'liked' => $likedVideo->liked,
                'disliked' => $likedVideo->disliked
            ]);
        }

       
    }
}

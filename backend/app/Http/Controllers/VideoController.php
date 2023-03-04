<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth, DB, Storage;
use App\Models\Video;
use App\Models\Channel;
use App\Models\Subscription;
use App\Models\Like_Dislike;
use Pion\Laravel\ChunkUpload\Exceptions\UploadFailedException;
use Illuminate\Http\UploadedFile;
use Pion\Laravel\ChunkUpload\Exceptions\UploadMissingFileException;
use Pion\Laravel\ChunkUpload\Handler\AbstractHandler;
use Pion\Laravel\ChunkUpload\Handler\HandlerFactory;
use Pion\Laravel\ChunkUpload\Receiver\FileReceiver;

function refreshLikesDislikes($video_id){
    $likes = Like_Dislike::where('video_id', $video_id)->where('liked', true)->get();
    $likesCount = $likes->count();
    $dislikes = Like_Dislike::where('video_id', $video_id)->where('disliked', true)->get();
    $dislikesCount = $dislikes->count();
    Video::where('id', $video_id)->update(['likes' => $likesCount, 'dislikes' => $dislikesCount]);
}

class VideoController extends Controller
{
    public function uploadVideo(Request $request){
        $lookup_url_kwarg = 'id';
        $channel_id = $request->$lookup_url_kwarg;
        $video = new Video;
     
        $receiver = new FileReceiver("file", $request, HandlerFactory::classFromRequest($request));

        if ($receiver->isUploaded() === false) {
            throw new UploadMissingFileException();
        }

        $save = $receiver->receive();
        if ($save->isFinished()) {
            return $this->saveFile($save->getFile(), $request);
        }
        $handler = $save->handler();
       
        error_log('finished');
        return response()->json([
            "done" => $handler->getPercentageDone(),
            'status' => true
        ]);
    }

    public function postVideo(Request $request){
        $lookup_url_kwarg = 'id';
        $video_id = $request->$lookup_url_kwarg;
        $user = Auth::user();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();

        $video = Video::firstOrCreate(['id' => $video_id], ['title' => $request->title, 'description' => $request->description, 'thumbnail' => $request->thumbnail, 'category' => $request->category]);
        $video->title = $request->title;
        $video->description = $request->description;
        
        if ($request->hasFile('thumbnail')){
            $thumbnail = $request->file('thumbnail');
            $thumbnailName = $thumbnail->getClientOriginalName();
            $finalName = date('His') . $thumbnailName;
            $pathName = $thumbnail->storeAs('thumbnails/', $finalName, 'public');
            $video->thumbnail = $pathName;
        }
        $video->channel_id = $userChannel->id;
        $video->category = $request->category;
        $video->pathName = $request->fileName;
        $video->save();

        return response([
            'message' => 'Video details are edited'
        ]);
    }

    protected function saveFile(UploadedFile $file, Request $request){
        $user = Auth::user();
        $video = new video;
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        $fileName = $this->createFilename($file);
        $mime_original = $file->getMimeType();
        $mime = str_replace('/', '-', $mime_original);
        $folderDATE = $request->dataDATE;

        $folder  = $folderDATE;
        $filePath = "public/upload/medialibrary/{$user->id}/{$folder}/";
        $finalPath = storage_path("app/" . $filePath);
        $fileSize = $file->getSize();
        $file->move($finalPath, $fileName);
        $url_base = 'storage/upload/medialibrary/' . $user->id . "/{$folderDATE}/" . $fileName;
        $video->pathName = $fileName;
        $video->channel_id = $userChannel->id;
        $video->save();

        return response()->json([
            'path' => $filePath,
            'name' => $fileName,
            'mime_type' => $mime
        ]);
    }

    protected function createFilename(UploadedFile $file){
        $extension = $file->getClientOriginalExtension();
        $filename = str_replace("." . $extension, "", $file->getClientOriginalName());
     

        return $filename . "." . $extension;
    }

    public function delete(Request $request){
        $user = Auth::user();
        $file = $request->filename;
        $temp_arr = explode('_', $file);
        if (isset($temp_arr[0])) unset($temp_arr[0]);
        $file = implode('_', $temp_arr);
        $dir = $request->date;
        $filePath = "public/upload/medialibrary/{$user_obj->id}/{$dir}/";
        $finalPath = storage_path("app/" . $filePath);

        if (unlink($finalPath . $file)) {
            return response()->json([
                'status' => 'ok'
            ], 200);
        } else {
            return response()->json([
                'status' => 'error'
            ], 403);
        }

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

    public function removeVideo(Request $request){
        $lookup_url_kwarg = 'id';
        $video_id = $request->$lookup_url_kwarg;
        Video::find($video_id)->delete();
    }

    public function getLikedVideos(Request $request){
        $lookup_url_kwarg = 'id';
        $channel_id = $request->$lookup_url_kwarg;
        $channel = Channel::where('id', $channel_id)->first();
        $videos = $channel->likedVideos()->get();
        return $videos->keyBy('video_id');
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

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth, DB, Storage;
use App\Models\Video;

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
        $video->channel_id = $channel_id;
        $video->save();

        return response([
            'message' => 'Video is created on this channel'
        ]);

    }

    public function getVideo(Request $request){
        $lookup_url_kwarg = 'id';
        $video_id = $request->$lookup_url_kwarg;
        $video = DB::table('videos')->where('id', $video_id)->first();
        if (!$video) throw new \ErrorException;
        return $video;
    }

    public function getChannelVideos(Request $request){
        $lookup_url_kwarg = 'id';
        $channel_id = $request->$lookup_url_kwarg;
        $videos = DB::table('videos')->where('channel_id', $channel_id)->get();
        if (!$videos) throw new \ErrorException;
        return $videos;
    }

    public function getHomeVideos(){
        $videos = DB::table('videos')->get();
        if (!$videos) throw new \ErrorException;
        return $videos;
    }


}

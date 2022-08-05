<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth, DB;
use App\Models\Channel, Video;

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
            $channel->thumbnail = $pathName;
        }

        if ($request->hasFile('video')){
            $file = $request->file('video');
            $fileName = $file->getClientOriginalName();
            $finalName = date('His') . $fileName;
            $pathName = $file->storeAs('videos/', $finalName, 'public');
            $channel->pathName = $pathName;
        }

        $video->channel_id =  intval($channel_id);
        $video->save();

        return response([
            'message' => 'Video is created on this channel'
        ]);


    }
}

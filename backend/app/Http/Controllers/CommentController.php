<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Video;
use App\Models\Channel;
use App\Models\Comment;

class CommentController extends Controller
{
    //
    public function postComment(Request $request){
        $comment = new Comment;
        $comment->text = $request->text;
        $video = Video::where('id', $request->videoID)->first();
        $video->comments()->save($comment);
        $channel = Channel::where('id', $request->channelID)->first();
        $channel->comments()->save($comment);
        $comment->save();

        return response([
            'message' => 'Comment is posted'
        ]);

    }
}

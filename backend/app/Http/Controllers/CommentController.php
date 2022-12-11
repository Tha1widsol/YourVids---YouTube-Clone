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
        $video = Video::where('id', $request->video_id)->first();
        $video->comments()->save($comment);
        $channel = Channel::where('id', $request->channel_id)->first();
        $channel->comments()->save($comment);
        $comment->save();

        return response([
            'comment' => $comment,
            'channel' => $channel
        ]);
    }

    public function getVideoComments(Request $request){
        $lookup_url_kwarg = 'id';
        $video_id = $request->$lookup_url_kwarg;
        $comments = Comment::with('channel')->with('replies', 'replies.channel','replies.parent','replies.parent.channel')->where('video_id', $video_id)->where('parent_id', null)->get();
        if (!$comments) throw new \ErrorException;
        return $comments;
    }

    public function postReply(Request $request){
        $reply = new Comment;
        $reply->text = $request->text;
        $rootComment = Comment::where('id', $request->root_id)->first();
        $video = Video::where('id', $request->video_id)->first();
        $video->comments()->save($reply);
        $channel = Channel::where('id', $request->channel_id)->first();
        $channel->comments()->save($reply);
        $comment = Comment::where('id', $request->comment_id)->first();
        $comment->replies()->save($reply);
        $comment->parents()->save($reply);
        $reply->root_id = $request->root_id;
        $reply->save();

        return response([
            'reply' => Comment::with('channel')->where('id', $reply->id)->first()
        ]);

    }
}

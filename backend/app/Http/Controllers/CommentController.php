<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Video;
use App\Models\Channel;
use App\Models\Comment;
use App\Models\Like_Dislike_Comment;

function refreshLikesDislikes($comment_id){
    $dislikes = Like_Dislike_Comment::where('comment_id', $comment_id)->where('disliked', true)->get();
    $likes = Like_Dislike_Comment::where('comment_id', $comment_id)->where('liked', true)->get();
    Comment::where('id', $comment_id)->update(['likes' => $likes->count(), 'dislikes' => $dislikes->count()]);
}

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

    public function likeComment(Request $request){
        $lookup_url_kwarg = 'id';
        $comment_id = $request->$lookup_url_kwarg;
        $user = Auth::user();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        Like_Dislike_Comment::updateOrCreate(
            ['channel_id' => $userChannel->id, 'comment_id' => $comment_id,], ['liked' => true, 'disliked' => false]
        );
        $dislike = Like_Dislike_Comment::where('comment_id', $comment_id)->where('channel_id', $userChannel->id)->where('disliked', true)->first();
        if ($dislike != null) $dislike->delete();

       refreshLikesDislikes($comment_id);
    }

    public function dislikeComment(Request $request){
        $lookup_url_kwarg = 'id';
        $comment_id = $request->$lookup_url_kwarg;
        $user = Auth::user();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        Like_Dislike_Comment::updateOrCreate(
            ['channel_id' => $userChannel->id, 'comment_id' => $comment_id,], ['liked' => false, 'disliked' => true]
        );
        $like = Like_Dislike_Comment::where('comment_id', $comment_id)->where('channel_id', $userChannel->id)->where('liked', true)->first();
        if ($like != null) $like->delete();

        refreshLikesDislikes($comment_id);
    }

    public function removeLikeDislike(Request $request){
        $lookup_url_kwarg = 'id';
        $comment_id = $request->$lookup_url_kwarg;
        $user = Auth::user();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        Like_Dislike_Comment::where('channel_id', $userChannel->id) ->where('comment_id','=',$comment_id)->delete();
        refreshLikesDislikes($comment_id);
    }


    public function checkLikedComment(Request $request){
        $lookup_url_kwarg = 'id';
        $comment_id = $request->$lookup_url_kwarg;
        $user = Auth::user();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        $likedComment = Like_Dislike_Comment::where('comment_id', $comment_id)->where('channel_id', $userChannel->id)->first();
        if ($likedComment){
            return response([
                'liked' => $likedComment->liked,
                'disliked' => $likedComment->disliked
            ]);
        }

       
    }


    public function getVideoComments(Request $request){
        $lookup_url_kwarg = 'id';
        $video_id = $request->$lookup_url_kwarg;
        $comments = Comment::with('channel')->with('replies', 'replies.channel','replies.parent','replies.parent.channel')->where('video_id', $video_id)->where('parent_id', null)->get();
        if (!$comments) throw new \ErrorException;
        return $comments;
    }
    
    public function getLikedDislikedComments(){
        $user = Auth::user();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        $comments = $userChannel->likedDislikedComments()->get(['comment_id', 'liked', 'disliked']);
        return $comments->keyBy('comment_id');
    }

    public function postReply(Request $request){
        $reply = new Comment;
        $reply->text = $request->text;
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

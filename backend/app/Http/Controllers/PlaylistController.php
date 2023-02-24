<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Channel;
use App\Models\Video;
use App\Models\Playlist;

class PlaylistController extends Controller
{
    public function createPlaylist(Request $request){
        $lookup_url_kwarg = 'id';
        $playlist_id = $request->$lookup_url_kwarg;
        
        $playlist = Playlist::updateOrCreate([
            'id' => $playlist_id !== 'undefined' ? $playlist_id : 0
        ],[
            'title' => $request->title,
            'description' => $request->description,
            'visibility' => $request->visibility
        ]);
       
        if ($playlist_id === 'undefined'){
            $user = Auth::user();
            $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
            $userChannel->playlists()->save($playlist);
            $playlist->save();
        }
    
        return response([
            'message' => 'Playlist is created on this channel'
        ]);
    }

    public function editPlaylist(Request $request){
        $lookup_url_kwarg = 'id';
        $playlist_id = $request->$lookup_url_kwarg;
        $playlist = Playlist::find($playlist_id);

        $playlist->title = $request->title;
        $playlist->description = $request->description;
        $playlist->visibility = $request->visibility;
        $playlist->save();

        return response([
            'message' => 'Playlist is edited'
        ]);
    }

    public function getPlaylists(Request $request){
        $lookup_url_kwarg = 'id';
        $channel_id = $request->$lookup_url_kwarg;
        $playlists = Playlist::with('channel')->with('videos')->where('channel_id', $channel_id)->get();
        if (!$playlists) throw new \ErrorException();
        return $playlists;
    }

    public function getPlaylist(Request $request){
        $lookup_url_kwarg = 'id';
        $playlist_id = $request->$lookup_url_kwarg;
        $playlist = Playlist::with('channel')->with('videos')->where('id', $playlist_id)->first();
        if (!$playlist) throw new \ErrorException();
        return $playlist;
    }

    public function addToPlaylist(Request $request){
        $video_lookup_url_kwarg = 'videoID';
        $video_id = $request->$video_lookup_url_kwarg;
        $playlist_lookup_url_kwarg = 'playlistID';
        $playlist_id = $request->$playlist_lookup_url_kwarg;
        $playlist = Playlist::where('id', $playlist_id)->first();
        $video = Video::where('id', $video_id)->first();
        $playlist->playlist()->attach($video);
        $playlist->increment('videoCount');
        $playlist->save();
        return $video;
    }

    public function saveVideo(Request $request){
        $lookup_url_kwarg = 'id';
        $video_id = $request->$lookup_url_kwarg;
        $user = Auth::user();
        $video = Video::where('id', $video_id)->first();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        $playlist = Playlist::where('channel_id', $userChannel->id)->where('title', 'Saved')->first();
        $playlist->playlist()->attach($video);
    }

    public function removeFromPlaylist(Request $request){
        $video_lookup_url_kwarg = 'videoID';
        $video_id = $request->$video_lookup_url_kwarg;
        $playlist_lookup_url_kwarg = 'playlistID';
        $playlist_id = $request->$playlist_lookup_url_kwarg;
        $playlist = Playlist::where('id', $playlist_id)->first();
        $video = Video::where('id', $video_id)->first();
        $playlist->playlist()->detach($video);
    }
}

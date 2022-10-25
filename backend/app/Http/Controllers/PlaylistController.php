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
        $playlist = new Playlist;
        $playlist->title = $request->title;
        $playlist->description = $request->description;
        $playlist->visibility = $request->visibility;
        $user = Auth::user();
        $userChannel = Channel::where('user_id', $user->id)->where('active', true)->first();
        $userChannel->playlists()->save($playlist);
        $playlist->save();

        return response([
            'message' => 'Playlist is created on this channel'
        ]);
    }

    public function getPlaylists(Request $request){
        $lookup_url_kwarg = 'id';
        $channel_id = $request->$lookup_url_kwarg;
        $playlists = Playlist::with('channel')->where('channel_id', $channel_id)->get();
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

    public function getPlaylistVideos(Request $request){
        $lookup_url_kwarg = 'id';
        $playlist_id = $request->$lookup_url_kwarg;
        $playlist = Playlist::where('id', $playlist_id)->first();
        $videos = $playlist->videos()->get();
        return $videos;
    }

    public function addToPlaylist(Request $request){
        $video_lookup_url_kwarg = 'videoID';
        $video_id = $request->$video_lookup_url_kwarg;
        $playlist_lookup_url_kwarg = 'playlistID';
        $playlist_id = $request->$playlist_lookup_url_kwarg;
        $playlist = Playlist::where('id', $playlist_id)->first();
        $video = Video::where('id', $video_id)->first();
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

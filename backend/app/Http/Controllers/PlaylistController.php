<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Channel;
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
}

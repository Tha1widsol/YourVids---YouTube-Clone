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
}

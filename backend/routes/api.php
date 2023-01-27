<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\PlaylistController;
use App\Http\Controllers\CommentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register',[UserController::class,'register']);
Route::post('/login',[UserController::class,'login']);
Route::get('/checkAuth',[UserController::class,'checkAuth']);
Route::get('/getChannel',[ChannelController::class,'getChannel']);
Route::get('/getVideo',[VideoController::class, 'getVideo']);
Route::get('/getVideos',[VideoController::class, 'getHomeVideos']);
Route::get('/getChannelVideos',[VideoController::class,'getChannelVideos']);

Route::get('/getVideoComments',[CommentController::class, 'getVideoComments']);
Route::get('/getCurrentChannel',[ChannelController::class, 'getCurrentChannel']);
Route::put('/incrementViews',[VideoController::class, 'incrementViews']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/getUser',[UserController::class,'getUser']);
    Route::post('/createChannel',[ChannelController::class,'createChannel']);
    Route::post('/uploadVideo',[VideoController::class, 'uploadVideo'])->withoutMiddleware('throttle');
    Route::post('/postVideo',[VideoController::class, 'postVideo']);
    Route::get('/userChannels',[ChannelController::class, 'getUserChannels']);
    Route::put('/subscribe',[ChannelController::class, 'subscribe']);
    Route::put('/unsubscribe',[ChannelController::class, 'unsubscribe']);
    Route::get('/checkSubscribed',[ChannelController::class, 'checkSubscribed']);
    Route::get('/getSubscriptionVideos',[VideoController::class, 'getSubscriptionVideos']);
    Route::get('/getSubscribers',[ChannelController::class, 'getSubscribers']);
    Route::get('/getLikedVideos', [VideoController::class, 'getLikedVideos']);
    Route::delete('/removeVideo', [VideoController::class, 'removeVideo']);
    Route::post('/likeVideo',[VideoController::class, 'likeVideo']);
    Route::post('/dislikeVideo',[VideoController::class, 'dislikeVideo']);
    Route::get('/checkLikedVideo',[VideoController::Class, 'checkLikedVideo']);
    Route::delete('/removeLikeDislike',[VideoController::class, 'removeLikeDislike']);
    Route::put('/switchChannel',[ChannelController::class, 'switchChannel']);
    Route::post('/createPlaylist', [PlaylistController::class, 'createPlaylist']);
    Route::get('/getPlaylists', [PlaylistController::class, 'getPlaylists']);
    Route::get('/getPlaylist', [PlaylistController::class, 'getPlaylist']);
    Route::put('/editPlaylist', [PlaylistController::class, 'editPlaylist']);
    Route::post('/addToPlaylist',[PlaylistController::class, 'addToPlaylist']);
    Route::post('/saveVideo',[PlaylistController::class, 'saveVideo']);
    Route::delete('/removeFromPlaylist',[PlaylistController::class, 'removeFromPlaylist']);
    Route::post('/postComment',[CommentController::class, 'postComment']);
    Route::delete('/removeComment',[CommentController::class, 'removeComment']);
    Route::post('/postReply',[CommentController::class, 'postReply']);
    Route::post('/likeComment', [CommentController::class, 'likeComment']);
    Route::post('/dislikeComment', [CommentController::class, 'dislikeComment']);
    Route::get('/getLikedDislikedComments',[CommentController::class, 'getLikedDislikedComments']);
    Route::delete('comment/removeLikeDislike', [CommentController::class, 'removeLikeDislike']);
    Route::post('/logout',[UserController::class,'logout']);
});


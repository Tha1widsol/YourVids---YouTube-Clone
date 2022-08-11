<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChannelController;
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

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/getUser',[UserController::class,'getUser']);
    Route::post('/createChannel',[ChannelController::class,'createChannel']);
    Route::get('/userChannels',[ChannelController::class, 'getUserChannels']);
    Route::get('/getCurrentChannel',[ChannelController::class, 'getCurrentChannel']);
    Route::put('/switchChannel',[ChannelController::class, 'switchChannel']);
    Route::post('/logout',[UserController::class,'logout']);
});


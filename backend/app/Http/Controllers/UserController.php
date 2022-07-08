<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Synfony\Component\HttpFoundation\Response;
use Cookie;

class UserController extends Controller
{
    public function register(Request $request){
        $user = new User;
        $user->username = $request->username;
        $user->password = Hash::make($request->password);
        $user->save();
        $token = $user->createToken('token')->plainTextToken;
        $cookie = cookie('jwt',$token, 68 * 24);

        return response([
            'message' => 'Success',
            'token' => $token,
        ]) -> withCookie($cookie);
    }

    public function login(Request $request){
        if (!Auth::attempt(['username' => $request->input('username'), 'password' => $request->input('password')])){
            return response(['message' => 'Failed']);
        }

        $user = Auth::user();
        $token = $user->createToken('token')->plainTextToken;
        $cookie = cookie('jwt',$token, 68 * 24);

        return response([
            'message' => 'Success',
            'token' => $token,
        ]) -> withCookie($cookie);
    }

    public function getUser(){
        return Auth::user();
    }

    public function checkAuth(){
        $isAuth = false;

        if (Cookie::has('jwt')){
           $isAuth = true;
        }

        return response([
            'isAuth' => $isAuth,
        ]);

    }

    public function logout(Request $request){
        $request->user()->tokens()->delete();
        $cookie = Cookie::forget('jwt');
        return response([
            'message' => 'Logged out'
        ]) -> withCookie($cookie);
    }
}

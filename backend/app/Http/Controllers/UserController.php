<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Synfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    public function register(Request $request){
        $user = new User;
        $user->username = $request->username;
        $user->password = Hash::make($request->password);
        $user->save();
        Auth::login($user);
        return $request-> input();
    }

    public function login(Request $request){
        if (!Auth::attempt(['username' => $request->input('username'), 'password' => $request->input('password')])){
            return response(['Message' => 'Invalid credentials']);
        }

        $user = Auth::user();
        $token = $user->createToken('token')->plainTextToken;
        $cookie = cookie('jwt',$token, 68 * 24);

        return response([
            'message' => 'Success'
        ]) -> withCookie($cookie);
    }

    public function getUser(){
        return Auth::user();
    }

    public function logout(Request $request){
        $request->user()->tokens()->delete();
        return response([
            'message' => 'Logged out'
        ]);
    }
}

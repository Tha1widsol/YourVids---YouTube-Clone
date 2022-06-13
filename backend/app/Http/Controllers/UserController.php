<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function createUser(Request $request){
        $user = new User;
        $user->username = $request->username;
        $user->password = $request->password;
        $user->save();
        return $request-> input();
    }
}

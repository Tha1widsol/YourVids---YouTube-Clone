import React from 'react'
import {NavLink} from 'react-router-dom';
import './css/Navbar.css';

export default function Navbar() {
  return (
    <div className = 'nav'>
        <NavLink to = '/' id = 'yourvids'>YourVids</NavLink>
        <NavLink to = '/home'>Home</NavLink>
        <NavLink to = '/register'>Sign up</NavLink>
        <NavLink to = '/login'>Login</NavLink>

    </div>
  )
}

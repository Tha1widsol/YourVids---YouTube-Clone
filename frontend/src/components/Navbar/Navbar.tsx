import React from 'react'
import {NavLink} from 'react-router-dom';
import './css/Navbar.css';
import {useAppSelector, useAppDispatch} from '../../app/hooks';
import {logout} from '../../features/Auth/auth';
import axios from 'axios'

export default function Navbar() {
  const user = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()

  function handleLogout(){
    axios.post('api/logout')
    .then(response => {
      if (response.status === 200) dispatch(logout())
    })
  }

  return (
    <div className = 'nav'>
        <NavLink to = '/' id = 'yourvids'>YourVids</NavLink>
        <NavLink to = '/home'>Home</NavLink>
        {user.isLoggedIn ?  
        <>
        <NavLink to = {`/user/${user.values?.username}/channels`}>Your channels</NavLink>
        <NavLink to = '/videos'>Your videos</NavLink>
        <button onClick = {handleLogout}>Logout</button>
        </>
        :
        <>
        <NavLink to = '/register'>Sign up</NavLink>
        <NavLink to = '/login'>Login</NavLink>
        </>
        }
       
    </div>
  )
}

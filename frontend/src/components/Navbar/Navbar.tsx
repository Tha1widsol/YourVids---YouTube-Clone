import React, { useState } from 'react'
import {NavLink} from 'react-router-dom';
import './css/Navbar.css';
import {useAppSelector, useAppDispatch} from '../../app/hooks';
import {logout} from '../../features/Auth/auth';
import {useGetUserChannelsQuery, useGetCurrentChannelQuery} from '../../features/channels/channels';
import axios from 'axios'

export default function Navbar() {
  const user = useAppSelector(state => state.user)
  const [dropdown, setDropdown] = useState({menu: false, channels: false})
  const channels = useGetUserChannelsQuery(null)
  const currentChannel = useGetCurrentChannelQuery(null)
  const dispatch = useAppDispatch()

  function handleLogout(){
    axios.post('/api/logout')
    .then(response => {
      if (response.status === 200) dispatch(logout())
    })
  }
  
  function handleSwitchChannel(id: number){
    const requestOptions = {
      headers: {'Content-Type': 'multipart/form-data'}
    }

    axios.put(`/api/switchChannel?id=${id}`,null, requestOptions)
    .then(response => {
      if (response.status === 200) {
        currentChannel.refetch()
        setDropdown({menu: true, channels: true})
      }
    })
  }

  return (
    <div className = 'nav'>
        <NavLink to = '/' id = 'yourvids'>YourVids</NavLink>
        <NavLink to = '/home'>Home</NavLink>
        {user.isLoggedIn ?  
        <>
        <NavLink to = {`/channel/${currentChannel.data?.id}`}>Your channel</NavLink>
        <NavLink to = '/videos'>Your videos</NavLink>
        <NavLink to = '/upload'>Upload</NavLink>
        <div className = 'dropdown'>
          <button id = 'navDropBtn' onClick={() => setDropdown({menu: !dropdown.menu, channels: false})}>My account</button>
              <div className = 'dropdown-content'>
                {dropdown.menu ? 
                    <>
                    <p><b>{currentChannel.data?.name}</b></p>
                    <button id = 'navDropBtn' onClick = {() => setDropdown({menu: false, channels: true})}>Switch channel</button>
                    <NavLink to = '/videos'>My Videos</NavLink>
                    <NavLink to = '/' onClick = {handleLogout}>Logout</NavLink>
                    </>
                    : dropdown.channels ?
                    <>
                    <div style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <p>Channels:</p>
                      <button id = 'navDropBtn' className = 'arrow' onClick = {() => setDropdown({menu: true, channels: false})}>Return</button>
                    </div>
                    {channels.data?.map((channel, index) => {
                      return (
                        <div key = {index}>
                          <button id = 'navDropBtn' onClick = {() => handleSwitchChannel(channel.id)}>{channel.name} <p style = {{fontSize: 'small', color: 'darkgray'}}>{channel.subscribers} subscribers</p></button>
                        </div>
                      )
                    })}
                    </>
                    : null}
              </div>
        </div>
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

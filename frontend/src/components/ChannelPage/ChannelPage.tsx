import React,{useEffect} from 'react'
import { useAppDispatch, useAppSelector, useQuery } from '../../app/hooks'
import { fetchChannel } from '../../features/channels/channel'
import { fetchCurrentChannel } from '../../features/channels/currentChannel'
import { fetchChannelVideos } from '../../features/videos/channelVideos'
import { fetchChannelSubscribers } from '../../features/channels/channelSubscribers'
import {Link, useParams} from 'react-router-dom'
import Channels from '../Channels/Channels'
import Videos from '../Videos/Videos'
import Subscribe from '../Subscribe/Subscribe'
import Playlists from '../Playlists/Playlists'
import { fetchPlaylists } from '../../features/playlists/playlists'
import ChannelNavbar from '../Navbar/ChannelNavbar'
import './css/ChannelPage.css'
import UserChannels from '../UserChannels/UserChannels'

export default function ChannelPage() {
    const query = useQuery()
    const tab = query.get('tab')
    const {channelID} = useParams()
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user)
    const channel = useAppSelector(state => state.channel)
    const currentChannel = useAppSelector(state => state.currentChannel)
    const videos = useAppSelector(state => state.channelVideos)
    const subscribers = useAppSelector(state => state.channelSubscribers)
    const playlists = useAppSelector(state => state.playlists)

    useEffect(() => {
      dispatch(fetchChannel(channelID))
      .then(response => {
        if (response.meta.requestStatus === 'fulfilled'){
          dispatch(fetchChannelVideos(channelID))
        }
      })
      
      if (!user.isLoggedIn) return
        dispatch(fetchChannelSubscribers(channelID))
        dispatch(fetchCurrentChannel())
        dispatch(fetchPlaylists(channelID))

    },[dispatch, channelID, user.isLoggedIn])


    
  return (
    <div>
      {channel.status === 'success' ? 
      <>
        {channel.values?.banner ? <img className = 'banner' src = {`/storage/${channel.values?.banner}`} alt = ''/> : null}
       <header className = 'channelHeader'>
        <div style = {{display: 'flex', gap: '20px'}}>
           {channel.values?.logo ? <img className = 'logo' src = {`/storage/${channel.values?.logo}`} alt = ''/> : null}
           <div>
              <p style = {{fontSize: 'larger'}}>{channel.values?.name}</p>
              <p style = {{color: 'gray'}}>{channel.values?.subscribers} subscribers</p>
           </div>
        </div>
         
         <div>
            {Number(channelID) !== currentChannel.values?.id || !user.isLoggedIn ? 
            <>          
            <Subscribe channel = {channel.values}/>
            <button>Notify</button>
            </>
            : 
            <>
            <button>Customise channel</button> 
            <Link to = '/videos'><button>Manage videos</button></Link>
           </>}
        
         </div>
       </header>
       
        <ChannelNavbar/>
        
        <hr className = 'mt-0-mb-4'/>
        {tab === 'featured' || !tab ? 
        <>
          <h2>Featured</h2>
          <Videos videos = {videos.values} AreOwnVideos = {Number(channelID) === currentChannel.values?.id}/>
        </>
        : 
        tab === 'videos' ? 
        <>
         <h2>Videos</h2>
          <Videos videos = {videos.values} AreOwnVideos = {Number(channelID) === currentChannel.values?.id}/>
        </>
        :
        tab === 'playlists' ?
        <>
        <h2>Playlists</h2>
          <Playlists playlists = {playlists.values}/>
     
        </>
        : null}
       
        {Number(channelID) === currentChannel.values?.id && subscribers.values.length ? 
        <>
         <hr className = 'mt-0-mb-4'/>
          <h3><b>Recent subscribers</b></h3>
          <Channels channels = {subscribers.values}/>
        </>
        : null}
      
      </>
      : channel.status === 'loading' ? 
      <>
          <p>Loading...</p>
        </>
      : <>
        <h2>Channel doesn't exist...</h2>
        <UserChannels/>
        </>}

       
    </div>
  )
}

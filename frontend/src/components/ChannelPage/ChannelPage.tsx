import React,{useEffect} from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchChannel } from '../../features/channels/channel'
import { fetchCurrentChannel } from '../../features/channels/currentChannel'
import { fetchChannelVideos } from '../../features/videos/channelVideos'
import { fetchChannelSubscribers } from '../../features/channels/channelSubscribers'
import { setSubscribers } from '../../features/channels/channel'
import {Link, useNavigate, useParams} from 'react-router-dom'
import Channels from '../Channels/Channels'
import Videos from '../Videos/Videos'
import './css/ChannelPage.css'
import axios from 'axios'

export default function ChannelPage() {
    const {channelID} = useParams()
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user)
    const channel = useAppSelector(state => state.channel)
    const currentChannel = useAppSelector(state => state.currentChannel)
    const videos = useAppSelector(state => state.channelVideos)
    const subscribers = useAppSelector(state => state.channelSubscribers)
    const navigate = useNavigate()

    const checkSubbed = () => {
      return subscribers.values?.find(sub => sub.id === currentChannel.values.id)
    }

    useEffect(() => {
      dispatch(fetchChannel(channelID))
      dispatch(fetchChannelVideos(channelID))
      
      if (!user.isLoggedIn) return
        dispatch(fetchChannelSubscribers(channelID))
        dispatch(fetchCurrentChannel())
    },[dispatch, channelID, user.isLoggedIn])

    function handleToggleSubscribe(isSubscribing = true){
      if (!currentChannel.status) {
        navigate('/login')
        return
      }

      const requestOptions = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.put(`/api/${isSubscribing ? 'subscribe' : 'unsubscribe'}?id=${channelID}`,null, requestOptions)
      .then(response => {
        if (response.status === 200) {
          if (isSubscribing){
            dispatch(setSubscribers(channel.values.subscribers + 1))
            return 
          }

          dispatch(setSubscribers(channel.values.subscribers - 1))
        }
      })
      window.location.reload()
    }
    
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
            {Number(channelID) !== currentChannel.values?.id ? 
            <>
            {!checkSubbed() ? <button type = 'button' onClick = {() => handleToggleSubscribe()}>Subscribe</button> : <button type = 'button' className = 'unsubscribe' onClick = {() => handleToggleSubscribe(false)}>Unsubscribe</button>}
          
            <button>Notify</button>
            </>
            : 
            <>
            <button>Customise channel</button> 
            <Link to = '/videos'><button>Manage videos</button></Link>
           </>}
        
         </div>
       </header>
      
        <hr className = 'mt-0-mb-4'/>
        <p>Videos:</p>
        <Videos videos = {videos.values} isOwnVideos = {Number(channelID) === currentChannel.values?.id}/>
        {Number(channelID) === currentChannel.values?.id ? 
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
        </>}

       
    </div>
  )
}

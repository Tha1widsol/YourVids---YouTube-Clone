import React,{useState, useEffect} from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchChannel } from '../../features/channels/channel'
import { fetchCurrentChannel } from '../../features/channels/currentChannel'
import { fetchChannelVideos } from '../../features/videos/channelVideos'
import { fetchChannelSubscribers } from '../../features/channels/channelSubscribers'
import { incrementSubscribers } from '../../features/channels/channel'
import {Link, useNavigate, useParams} from 'react-router-dom'
import Videos from '../Videos/Videos'
import './css/ChannelPage.css'
import axios from 'axios'

export default function ChannelPage() {
    const {channelID} = useParams()
    const dispatch = useAppDispatch()
    const channel = useAppSelector(state => state.channel)
    const currentChannel = useAppSelector(state => state.currentChannel)
    const videos = useAppSelector(state => state.channelVideos)
    const subscribers = useAppSelector(state => state.channelSubscribers)
    const [alreadySubscribed, setAlreadySubscribed] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
      dispatch(fetchChannel(channelID))
      dispatch(fetchCurrentChannel())
      dispatch(fetchChannelSubscribers(channelID))
      dispatch(fetchChannelVideos(channelID))
  
      if (subscribers.values?.find(sub => sub.id === currentChannel.values?.id)) setAlreadySubscribed(true)
    },[currentChannel?.values?.id, subscribers.values])

    function handleToggleSubscribe(isSubscribing = true){
      if (currentChannel.status === 'rejected') navigate('/login')

      const requestOptions = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.put(`/api/${isSubscribing ? 'subscribe' : 'unsubscribe'}?id=${channelID}`,null, requestOptions)
      .then(response => {
        if (response.status === 200) {
            setAlreadySubscribed(isSubscribing ? true : false)
            dispatch(incrementSubscribers())
        }
      })
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
            {!alreadySubscribed ? <button type = 'button' onClick = {() => handleToggleSubscribe()}>Subscribe</button> : <button type = 'button' className = 'unsubscribe' onClick = {() => handleToggleSubscribe(false)}>Unsubscribe</button>}
          
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

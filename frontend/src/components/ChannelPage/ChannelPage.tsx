import React,{useState, useEffect} from 'react'
import {useGetChannelQuery} from '../../features/channels/channel'
import { useGetChannelVideosQuery } from '../../features/videos/channelVideos'
import { useGetCurrentChannelQuery } from '../../features/channels/currentChannel'
import { useGetSubscribersQuery } from '../../features/subscribers/getSubscribers'
import {Link, useParams} from 'react-router-dom'
import Videos from '../Videos/Videos'
import './css/ChannelPage.css'
import axios from 'axios'

export default function ChannelPage() {
    const {channelID} = useParams()
    const currentChannel = useGetCurrentChannelQuery(null)
    const videos = useGetChannelVideosQuery(channelID || '')
    const [alreadySubscribed, setAlreadySubscribed] = useState(false)
    const channel = useGetChannelQuery(channelID)
    const subscribers = useGetSubscribersQuery(channelID)

    useEffect(() => {
      if (subscribers.data?.find(sub => sub.id === currentChannel.data?.id)) setAlreadySubscribed(true)
    },[currentChannel?.data?.id, subscribers.data])

    function handleToggleSubscribe(isSubscribing = true){
      const requestOptions = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.put(`/api/${isSubscribing ? 'subscribe' : 'unsubscribe'}?id=${channelID}`,null, requestOptions)
      .then(response => {
        if (response.status === 200) {
            setAlreadySubscribed(isSubscribing ? true : false)
            channel.refetch()
        }
      })
    }
    
  return (
    <div>
      {channel.isSuccess ? 
      <>
        {channel.data?.banner ? <img className = 'banner' src = {`/storage/${channel.data?.banner}`} alt = ''/> : null}
       <header className = 'channelHeader'>
        <div style = {{display: 'flex', gap: '20px'}}>
           {channel.data?.logo ? <img className = 'logo' src = {`/storage/${channel.data?.logo}`} alt = ''/> : null}
           <div>
              <p style = {{fontSize: 'larger'}}>{channel.data?.name}</p>
              <p style = {{color: 'gray'}}>{channel.data?.subscribers} subscribers</p>
           </div>
        </div>
         
         <div>
            {Number(channelID) !== currentChannel.data?.id ? 
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
        <Videos videos = {videos.data} isOwnVideos = {Number(channelID) === currentChannel.data?.id}/>
      </>
      : channel.isLoading ? 
      <>
          <p>Loading...</p>
        </>
      : <>
        <h2>Channel doesn't exist...</h2>
        </>}

       
    </div>
  )
}

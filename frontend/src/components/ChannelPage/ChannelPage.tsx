import React from 'react'
import {useGetChannelQuery} from '../../features/channels/channels'
import {useParams} from 'react-router-dom'

export default function ChannelPage() {
    const {channelID} = useParams()
    const channel = useGetChannelQuery(channelID || '')
    
  return (
    <div>
      
      <div className = 'center'>
      {channel.isSuccess ? 
      <>
        <h1>{channel.data?.name}</h1>
        <p>{channel.data?.description}</p>
        <p style = {{color: 'gray'}}>{channel.data?.subscribers} subscribers</p>
        <button type = 'button'>Upload video</button>
        <hr className = 'mt-0-mb-4'/>
      </>
      : channel.isLoading ? 
        <>
          <p>Loading...</p>
        </>
      : <>
        <h1>Channel doesn't exist</h1>
        </>}
         

      </div>
       
    </div>
  )
}

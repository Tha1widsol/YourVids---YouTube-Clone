import React from 'react'
import { useGetCurrentChannelQuery } from '../../features/channels/currentChannel'
import { useGetChannelVideosQuery } from '../../features/videos/channelVideos'
import './css/ChannelVideosPage.css'
import Videos from '../Videos/Videos'

export default function ChannelVideosPage() {
  const currentChannel = useGetCurrentChannelQuery(null)
  const videos = useGetChannelVideosQuery(currentChannel.data?.id || '')
  
  return (
    <div>
      <h2>Your videos:</h2>
      <Videos videos = {videos.data} isRow = {false} isOwnVideos = {true}/>
    </div>
  )
}

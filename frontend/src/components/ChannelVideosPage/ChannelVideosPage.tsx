import React from 'react'
import { useGetCurrentChannelQuery } from '../../features/channels/currentChannel'
import './css/ChannelVideosPage.css'
import ChannelVideos from '../ChannelVideos/ChannelVideos'

export default function ChannelVideosPage() {
  const currentChannel = useGetCurrentChannelQuery(null)
  return (
    <div>
      <h2>Your videos:</h2>
      <ChannelVideos id = {currentChannel.data?.id || ''}/>
    </div>
  )
}

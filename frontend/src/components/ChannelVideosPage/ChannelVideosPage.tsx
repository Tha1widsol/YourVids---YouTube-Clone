import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetCurrentChannelQuery } from '../../features/channels/currentChannel'
import { useGetChannelVideosQuery } from '../../features/videos/channelVideos'

export default function ChannelVideosPage() {
  const currentChannel = useGetCurrentChannelQuery(null)
  const videos = useGetChannelVideosQuery(currentChannel.data?.id.toString() || '')
  
  return (
    <div>
      <h2>Your videos:</h2>

    </div>
  )
}

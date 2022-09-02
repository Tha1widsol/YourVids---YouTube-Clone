import React from 'react'
import { useGetHomeVideosQuery } from '../../features/videos/homeVideos'
import Videos from '../Videos/Videos'
import '../ChannelVideosPage/css/ChannelVideosPage.css'

export default function HomePage() {
  const videos = useGetHomeVideosQuery(null)

  return (
    <div>
        <Videos videos = {videos.data}/>
    </div>
  )
  
}


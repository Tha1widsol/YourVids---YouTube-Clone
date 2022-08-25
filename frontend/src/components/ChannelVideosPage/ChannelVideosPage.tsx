import React from 'react'
import { Link } from 'react-router-dom'
import { useGetCurrentChannelQuery } from '../../features/channels/currentChannel'
import { useGetChannelVideosQuery } from '../../features/videos/channelVideos'
import './css/ChannelVideosPage.css'

export default function ChannelVideosPage() {
  const currentChannel = useGetCurrentChannelQuery(null)
  const videos = useGetChannelVideosQuery(currentChannel.data?.id.toString() || '')
  
  return (
    <div>
      <h2>Your videos:</h2>
      <section className = 'videosContainer'>
        {videos.data?.map((video, index) =>{
          return (
            <Link to = {`/video/${video.id}`}>
              <div className = 'videoContainer' key = {index}>
                  <img className = 'thumbnail' src = {`/storage/${video.thumbnail || video.pathName}`} alt = ''/>
                  <b><p>{video.title}</p></b>
                  <p className = 'smallGray'>
                    {video.views} views
                    - {video.created_at.slice(0, 10)}
                    </p>
                  
              </div>
           </Link>
          )
        })}
      </section>
    </div>
  )
}

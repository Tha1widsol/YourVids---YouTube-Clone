import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { useGetChannelVideosQuery } from '../../features/videos/channelVideos'
import ReactPlayer from 'react-player'
import './css/ChannelVideos.css'

export default function ChannelVideos({id}: {id: string | number}) {
  const videos = useGetChannelVideosQuery(id)
  const videoProgress = useAppSelector(state => state.videoProgress.value)
  
  return videos.isSuccess ? (
    <>
       {videos.data?.length ? 
       <>
          <section className = 'videosContainer'>
                {videos.data?.map((video, index) =>{
                return (
                    <Link to = {`/video/${video.id}`} key = {index}>
                        <div className = 'videoContainer'>
                            <div className = 'thumbnailContainer'>
                            <ReactPlayer width = '200px' height = '100px' url = {`/storage/${video.pathName}` } light = {video.thumbnail ? `/storage/${video.thumbnail}` : false} playIcon = {<></>}/>
                               <p className = 'duration'>{video.length}</p>
                            </div>
                            <b><p>{video.title}</p></b>
                            <p className = 'smallGray'>
                                {video.views} views
                                - {video.created_at.slice(0, 10)}
                            </p>
                        </div>
                    </Link>
                )
                })}
                {videoProgress > 0 ? 
                    <div className = 'thumbnail skeleton center'>
                        <p>Progress - {videoProgress}</p>
                    </div>
                : null}
              
            </section>
        </>
        :
        <>
      
        <p>No videos posted...</p>
        <Link to = '/upload'><button>Upload</button></Link>
        </>}
    </>
  ) : <p>Loading...</p>
  
}

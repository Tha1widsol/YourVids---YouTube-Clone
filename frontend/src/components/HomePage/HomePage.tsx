import React from 'react'
import { Link } from 'react-router-dom'
import ReactPlayer from 'react-player'
import {useAppSelector} from '../../app/hooks'
import { useGetHomeVideosQuery} from '../../features/videos/homeVideos'
import '../ChannelVideosPage/css/ChannelVideosPage.css'

export default function HomePage() {
  const videos = useGetHomeVideosQuery(null)

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
            </section>
        </>
        :
        <>
      
        <p>No videos posted...</p>
        </>}
    </>
  ) : <p>Loading...</p>
  
}


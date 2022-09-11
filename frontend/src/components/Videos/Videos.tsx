import React from 'react'
import { Link } from 'react-router-dom'
import { VideosProps } from '../../features/videos/types/VideoProps'
import { useAppSelector } from '../../app/hooks'
import ReactPlayer from 'react-player'
import './css/Videos.css'

export default function Videos({videos, isRow = true, isOwnVideos = false}: {videos: VideosProps['values'] | undefined, isRow?: boolean, isOwnVideos?: boolean}) {
  const videoProgress = useAppSelector(state => state.videoProgress.value)
  
  return videos ? (
    <>
       {videos?.length ? 
       <>
          <section className = {`videosContainer ${isRow ? 'row' : 'col'} `}>
                {videos?.map((video, index) =>{
                return (
                    <Link to = {`/video/${video.id}`} key = {index}>
                        <div className = 'videoContainer'>
                            <div className = 'thumbnailContainer'>
                            <ReactPlayer width = '200px' height = '100px' url = {`/storage/${video.pathName}` } light = {video.thumbnail ? `/storage/${video.thumbnail}` : false} playIcon = {<></>}/>
                               <p className = 'duration'>{video.length}</p>
                            </div>
                            <b><p>{video.title}</p></b>
                            <div className = 'smallGray'>
                                <p>{video.channel?.name}</p>
                                  {video.views} views
                                - {video.created_at.slice(0, 10)}
                            </div>
                        </div>
                    </Link>
                )
                })}
                {isOwnVideos && videoProgress > 0 ? 
                    <div className = 'thumbnail skeleton center'>
                        <p>Progress - {videoProgress}</p>
                    </div>
                : null}
              
            </section>
        </>
        :
        <>
      
        <p>No videos posted...</p>
        {isOwnVideos ? <Link to = '/upload'><button>Upload</button></Link> : null}
        </>}
    </>
  ) : <p>Loading...</p>
  
}

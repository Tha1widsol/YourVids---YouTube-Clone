import React from 'react'
import { Link } from 'react-router-dom'
import { useGetChannelVideosQuery } from '../../features/videos/channelVideos'
import './css/ChannelVideos.css'

export default function ChannelVideos({id}: {id: string | number}) {
  const videos = useGetChannelVideosQuery(id)
  
  return videos.isSuccess ? (
    <>
       {videos.data?.length ? 
            <section className = 'videosContainer'>
                {videos.data?.map((video, index) =>{
                return (
                    <Link to = {`/video/${video.id}`} key = {index}>
                        <div className = 'videoContainer' >
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
        :
        <>
        <p>No videos posted...</p>
        <Link to = '/upload'><button>Upload</button></Link>
        </>}
    </>
  ) : <p>Loading...</p>
  
}

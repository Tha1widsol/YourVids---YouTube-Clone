import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGetVideoQuery } from '../../features/videos/video'
import { useGetCurrentChannelQuery } from '../../features/channels/currentChannel'
import { useGetChannelQuery } from '../../features/channels/channel'
import ReactPlayer from 'react-player'
import './css/VideoPage.css'

export default function VideoPage() {
    const {videoID} = useParams()
    const video = useGetVideoQuery(videoID)
    const currentChannel = useGetCurrentChannelQuery(null)
    const channel = useGetChannelQuery(video.data?.channel_id)

  return video.isSuccess ? (
    <div>
        <section style = {{maxWidth: '60%'}}>
            <p className = 'title'>{video.data?.title}</p>
            <ReactPlayer url = {`/storage/${video.data?.pathName}`} controls playing/> 
            <div className = 'alignRow likesDislikes'>
                <p className = 'views smallGray'>{video.data?.views.toLocaleString()} views</p>
                <i className = 'fa fa-thumbs-up'/>
                <p>{video.data?.likes}</p>
                <i className = 'fa fa-thumbs-down'/>
                <p>{video.data?.dislikes}</p>
                <button>Save</button>
            </div>
            <hr className = 'mt-0-mb-4'/>

            {channel.data?.id !== currentChannel.data?.id ? <button type = 'button' className = 'subscribe'>Subscribe</button> : <button className = 'edit' type = 'button'>Edit</button>}
            <section style = {{display: 'flex', columnGap: '10px'}}>
                <Link to = {`/channel/${channel.data?.id}`}>
                <img className = 'logo' style = {{width: '50px', height: '50px'}} src = {`/storage/${channel.data?.logo}`} alt = ''/>
                <div>
                    <p>{channel.data?.name}</p>
                    <p className = 'smallGray'>{channel.data?.subscribers} subscribers</p>
                </div>
                </Link>
            </section>

            <p className = 'description'>{video.data?.description}</p>
            <hr className = 'mt-0-mb-4'/>
            <p>Comments:</p>
        </section>
    
    </div>
 ) : video.isError ? <p>404 page not found</p> : <p>Loading...</p>
}

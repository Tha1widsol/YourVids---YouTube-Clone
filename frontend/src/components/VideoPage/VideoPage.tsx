import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGetVideoQuery } from '../../features/videos/video'
import { useGetCurrentChannelQuery } from '../../features/channels/currentChannel'
import ReactPlayer from 'react-player'
import './css/VideoPage.css'

export default function VideoPage() {
    const {videoID} = useParams()
    const video = useGetVideoQuery(videoID || '')
    const channel = useGetCurrentChannelQuery(null)

  return video.isSuccess ? (
    <div>
        <section style = {{maxWidth: '60%'}}>
            <p className = 'title'>{video.data?.title}</p>
            <ReactPlayer url = {`/storage/${video.data?.pathName}`} controls = {true}/> 
            <div className = 'alignRow likesDislikes'>
                <p className = 'views smallGray'>{video.data?.views.toLocaleString()} views</p>
                <i className = 'fa fa-thumbs-up'/>
                <p>{video.data?.likes}</p>
                <i className = 'fa fa-thumbs-down'/>
                <p>{video.data?.dislikes}</p>
                <button>Save</button>
            </div>
            <hr className = 'mt-0-mb-4'/>
            <button type = 'button' className = 'subscribe'>Subscribe</button>
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
 ) : <p>Loading...</p>
}

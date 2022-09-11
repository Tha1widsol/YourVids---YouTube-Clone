import React,{useState, useEffect} from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchVideo } from '../../features/videos/video'
import { fetchCurrentChannel } from '../../features/channels/currentChannel'
import ReactPlayer from 'react-player'
import './css/VideoPage.css'
import axios from 'axios'

export default function VideoPage() {
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user)
    const {videoID} = useParams()
    const video = useAppSelector(state => state.video)
    const currentChannel = useAppSelector(state => state.currentChannel)
    const [videoFilePath, setVideoFilePath] = useState('')

    useEffect(() => {
        if (user.isLoggedIn) dispatch(fetchCurrentChannel())
         dispatch(fetchVideo(videoID))
        if (!video.values?.pathName) return

        axios({
            method: 'get',
            url: `/storage/${video.values?.pathName}`,
            responseType: 'blob',
        })

        .then(response => {
            const blob = response.data
            const url = URL.createObjectURL(blob);
            setVideoFilePath(url)
        })
    },[video.values?.pathName, dispatch, videoID, user.isLoggedIn])

  return video.status === 'success' ? (
    <div>
        <section style = {{maxWidth: '60%'}}>
            <p className = 'title'>{video.values?.title}</p>
            <ReactPlayer className = 'skeleton' url = {videoFilePath} controls playing/> 
           
            <div className = 'row likesDislikes'>
                <p className = 'views smallGray'>{video.values?.views.toLocaleString()} views</p>
                <i className = 'fa fa-thumbs-up'/>
                <p>{video.values?.likes}</p>
                <i className = 'fa fa-thumbs-down'/>
                <p>{video.values?.dislikes}</p>
                <button>Save</button>
            </div>
            <hr className = 'mt-0-mb-4'/>

            {video.values.channel.id !== currentChannel.values?.id ? <button type = 'button' className = 'subscribe'>Subscribe</button> : <button className = 'edit' type = 'button'>Edit</button>}
            <section style = {{display: 'flex', columnGap: '10px'}}>
                <Link to = {`/channel/${video.values.channel.id}`}>
                {video.values?.channel?.logo ?   <img className = 'logo' style = {{width: '50px', height: '50px'}} src = {`/storage/${video.values?.channel?.logo}`} alt = ''/> : null}
                <div>
                    <p>{video.values?.channel?.name}</p>
                    <p className = 'smallGray'>{video.values?.channel?.subscribers} subscribers</p>
                </div>
                </Link>
            </section>

            <p className = 'description'>{video.values?.description}</p>
            <hr className = 'mt-0-mb-4'/>
            <p>Comments:</p>
        </section>
    
    </div>
 ) : video.status === 'rejected' ? <p>404 page not found</p> : <p>Loading...</p>
}

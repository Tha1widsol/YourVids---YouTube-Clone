import React,{useState, useEffect} from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchVideo } from '../../features/videos/video'
import { fetchCurrentChannel } from '../../features/channels/currentChannel'
import { setLikes, setDislikes } from '../../features/videos/video'
import Subscribe from '../Subscribe/Subscribe'
import ReactPlayer from 'react-player'
import './css/VideoPage.css'
import Popup from '../Popup/Popup'
import PlaylistsCheckbox from '../Playlists/PlaylistsCheckbox'
import Comments from '../Comments/Comments'
import { fetchVideoComments } from '../../features/comments/comments'
import { addComment } from '../../features/comments/comments'
import axios from 'axios'

export default function VideoPage() {
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user)
    const {videoID} = useParams()
    const video = useAppSelector(state => state.video)
    const currentChannel = useAppSelector(state => state.currentChannel)
    const [comment, setComment] = useState('')
    const [videoFilePath, setVideoFilePath] = useState('')
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)
    const [popup, setPopup] = useState({playlist: false})
    const comments = useAppSelector(state => state.videoComments)

    useEffect(() => {
        dispatch(fetchVideo(videoID))
        .then(response => {
            if (response.meta.requestStatus === 'fulfilled'){
                axios({
                    method: 'get',
                    url: `/storage/${response.payload.pathName}`,
                    responseType: 'blob',
                })
        
                .then(response => {
                    const blob = response.data
                    const url = URL.createObjectURL(blob);
                    setVideoFilePath(url)
                })
            }
        })

        if (user.isLoggedIn) dispatch(fetchCurrentChannel())

     
        axios.get(`/api/checkLikedVideo?id=${videoID}`)
        .then(response => {
            const data = response.data
    
            if (data.liked) {
                setLiked(true)
            }

            if (data.disliked) {
                setDisliked(true)
            }

           dispatch(fetchVideoComments(videoID))
        })

    },[dispatch, videoID, user.isLoggedIn])

    function handleLikeVideo(){
        setLiked(!liked)
        setDisliked(false)
        if (!liked){
            dispatch(setLikes(video.values?.likes + 1)) 
            axios.post(`/api/likeVideo?id=${videoID}`)
            if (disliked) dispatch(setDislikes(video.values?.dislikes - 1))
            return
        }
        dispatch(setLikes(video.values?.likes - 1))
        axios.delete(`/api/removeLikeDislike?id=${videoID}`)
    }

    function handleDislikeVideo(){
        setDisliked(!disliked)
        setLiked(false)
        if (!disliked){
            dispatch(setDislikes(video.values?.dislikes + 1))
            axios.post(`/api/dislikeVideo?id=${videoID}`)
            if (liked) dispatch(setLikes(video.values?.likes - 1))
            return
        }
        dispatch(setDislikes(video.values?.dislikes - 1))
        axios.delete(`/api/removeLikeDislike?id=${videoID}`)
    }

    function handleAddComment(e: React.SyntheticEvent){
        e.preventDefault()
        const requestOptions = { 
            headers:{'Content-Type':'application/json', 'Accept':'application/json'}
          }

        let form = new FormData();
        form.append('video_id', videoID || '')
        form.append('channel_id', String(currentChannel.values?.id) || '')
        form.append('text', comment)

        axios.post('/api/postComment', form, requestOptions)
        .then(response => {
            if (response.status === 200) {
                const comment = response.data.comment
                const channel = response.data.channel

                dispatch(addComment({
                    channel: channel,
                    text: comment.text,
                    likes: 0,
                    dislikes: 0,
                    created_at: comment.created_at
                }))
                setComment('')
            }
        })
      

    }

  return video.status === 'success' ? (
    <div>
        <Popup trigger = {popup.playlist} switchOff = {() => setPopup(prev => {return{...prev, playlist: false}})}>
            <PlaylistsCheckbox/>
        </Popup>

        <section style = {{maxWidth: '60%'}}>
            <p className = 'title'>{video.values?.title}</p>
            <ReactPlayer className = 'skeleton' url = {videoFilePath} controls playing/> 
           
            <div className = 'row likesDislikes'>
                <p className = 'views smallGray'>{video.values?.views.toLocaleString()} views</p>
                <i className = 'fa fa-thumbs-up' style = {liked ? {color: 'green'} : {}} onClick = {handleLikeVideo}/>
                <p>{video.values?.likes}</p>
                <i className = 'fa fa-thumbs-down' style = {disliked ? {color: 'red'} : {}} onClick = {handleDislikeVideo}/>
                <p>{video.values?.dislikes}</p>
                <button onClick = {() => setPopup(prev => {return{...prev, playlist: true}})}>Save</button>
            </div>
            <hr className = 'mt-0-mb-4'/>

            {video.values.channel.id !== currentChannel.values?.id || !user.isLoggedIn ? <div style = {{float: 'right'}}><Subscribe channel = {video.values?.channel}/></div> : <button className = 'edit' type = 'button'>Edit</button>}
            <section style = {{display: 'flex', columnGap: '10px'}}>
                <Link to = {`/channel/${video.values.channel.id}`}>
                    {video.values?.channel?.logo ?  <img className = 'logo' src = {`/storage/${video.values?.channel?.logo}`} alt = ''/> : null}
                    <div>
                        <p>{video.values?.channel?.name}</p>
                        <p className = 'smallGray'>{video.values?.channel?.subscribers} subscribers</p>
                    </div>
                </Link>
            </section>

            <p className = 'description'>{video.values?.description}</p>
            <hr className = 'mt-0-mb-4'/>
            <p>Comments:</p>
            <form style = {{margin: 'unset'}} onSubmit = {handleAddComment}>
                <input type = 'text' value = {comment} onChange = {e => setComment(e.target.value)} placeholder = 'Add comment...'/>
                <button>Post</button>
            </form>
    
            <Comments comments = {comments.values}/>
        </section>
    
    </div>
 ) : video.status === 'rejected' ? <p>404 page not found</p> : <p>Loading...</p>
}

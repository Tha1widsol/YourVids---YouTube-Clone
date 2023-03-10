import React,{useState, useEffect} from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchVideo } from '../../features/videos/video'
import { fetchCurrentChannel } from '../../features/channels/currentChannel'
import { setLikes, setDislikes } from '../../features/videos/video'
import Subscribe from '../Subscribe/Subscribe'
import ReactPlayer from 'react-player'
import './css/VideoPage.css'
import Popup from '../Popup/Popup'
import PlaylistsCheckbox from '../Playlists/PlaylistsCheckbox'
import CommentsSection from '../Comments/CommentsSection'
import { fetchVideoComments } from '../../features/comments/comments'
import { removeVideo } from '../../features/videos/channelVideos'
import axios from 'axios'
import { fetchChannelVideos } from '../../features/videos/channelVideos'
import { incrementViews } from '../../features/videos/video'
import Videos from '../Videos/Videos'

export default function VideoPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
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
    const videos = useAppSelector(state => state.channelVideos)
    const [loadLikesDislikes, setLoadLikesDislikes] = useState(false)
    const playlists = useAppSelector(state => state.playlists)
    console.log(videoFilePath)

    useEffect(() => {
        dispatch(fetchVideo(videoID))
        .then(response => {
            if (response.meta.requestStatus === 'fulfilled'){
                axios({
                    method: 'get',
                    url: response.payload.pathName,
                    responseType: 'blob',
                })
        
                .then(response => {
                    const blob = response.data
                    const url = URL.createObjectURL(blob);
                    setVideoFilePath(url)
                })

                .finally(() => {
                    axios.put(`/api/incrementViews?id=${videoID}`)
                    .then(response => {
                        if (response.status === 200){
                            dispatch(incrementViews())
                        }
                    })
                })
            }
        })


        dispatch(fetchChannelVideos(video.values?.channel.id))
        .then(response => {
            if (response.meta.requestStatus === 'fulfilled'){
                dispatch(removeVideo(videoID))
               
            }
        })
     
        dispatch(fetchVideoComments(videoID))  

        if (!user.isLoggedIn){
            setLoadLikesDislikes(true)
            return
        }
            dispatch(fetchCurrentChannel())
            .then(response => {
                if (response.meta.requestStatus === 'fulfilled' && currentChannel.status === 'success'){
                    axios.get(`/api/getLikedVideos?id=${currentChannel.values?.id}`)
                    .then(response => {
                        if (response.status === 200){
                            const likedVideos = response.data
                            setLoadLikesDislikes(true)
            
                            if (likedVideos[videoID!]?.liked) {
                                setLiked(true)
                                return
                            }

                            setDisliked(true)
                        }
                       
                      
                    })
                }
            })
        
      
    },[dispatch, videoID, user.isLoggedIn, currentChannel.values?.id])

    function handleLikeVideo(){
        setLiked(!liked)
        setDisliked(false)
        if (!liked){
            dispatch(setLikes(video.values?.likes + 1)) 
            axios.post(`/api/likeVideo?id=${videoID}`)
            .then(response => {
                if (response.status !== 200) dispatch(setLikes(video.values?.likes - 1)) 
            })
        
            if (disliked) dispatch(setDislikes(video.values?.dislikes - 1))
            return
        }

        dispatch(setLikes(video.values?.likes - 1))
        axios.delete(`/api/removeLikeDislike?id=${videoID}`)
        .then(response => {
            if (response.status !== 200) dispatch(setLikes(video.values?.likes + 1))
        })
       
    }

    function handleDislikeVideo(){
        setDisliked(!disliked)
        setLiked(false)
        if (!disliked){
            dispatch(setDislikes(video.values?.dislikes + 1))
            axios.post(`/api/dislikeVideo?id=${videoID}`)
            .then(response => {
                if (response.status !== 200){
                    dispatch(setDislikes(video.values?.dislikes - 1))
                }
            })
            if (liked) dispatch(setLikes(video.values?.likes - 1))
            return
        }

        dispatch(setDislikes(video.values?.dislikes - 1))
        axios.delete(`/api/removeLikeDislike?id=${videoID}`)
        .then(response => {
            if (response.status !== 200) dispatch(setDislikes(video.values?.dislikes + 1))
        })
    }

    function handleAddComment(e: React.SyntheticEvent){
        e.preventDefault()
        if (comment === '') return

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
                dispatch(fetchVideoComments(videoID))
                setComment('')
            }
        })
        .catch(error => {
            if (error.response.status === 401) navigate('/login')
        })

    }

  return video.status === 'success' ? (
    <div>
        <Popup trigger = {popup.playlist} switchOff = {() => setPopup(prev => {return{...prev, playlist: false}})}>
            <PlaylistsCheckbox playlists = {playlists.values} chosenVideoID = {Number(videoID)}/>
        </Popup>

    <div className = 'row' style = {{justifyContent: 'space-evenly'}}>
      <section style = {{maxWidth: '60%'}}>
            <p className = 'title'>{video.values?.title}</p>
            <ReactPlayer className = 'skeleton' url = {videoFilePath} controls playing/> 
             
            {loadLikesDislikes ?
              <div className = 'row likesDislikes'>
                <p className = 'views smallGray'>{video.values?.views.toLocaleString()} views</p>
                <i className = 'fa fa-thumbs-up' style = {liked ? {color: 'green'} : {}} onClick = {handleLikeVideo}/>
                <p>{video.values?.likes}</p>
                <i className = 'fa fa-thumbs-down' style = {disliked ? {color: 'red'} : {}} onClick = {handleDislikeVideo}/>
                <p>{video.values?.dislikes}</p>
                <button onClick = {() => setPopup(prev => {return{...prev, playlist: true}})}>Save</button>
             </div>
           : <p>Loading...</p>}
          
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
    
            <CommentsSection comments = {comments} videoChannelID = {video.values?.channel.id}/>
        </section>

        <section>
             <Videos videos = {videos.values} isRow = {false}/>
        </section>
    </div>
       
       
    </div>
 ) : video.status === 'rejected' ? <p>404 page not found</p> : <p>Loading...</p>
}

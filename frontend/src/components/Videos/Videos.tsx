import React,{useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { VideosProps } from '../../features/videos/types/VideoProps'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import ReactPlayer from 'react-player'
import KebabMenu from '../KebabMenu/KebabMenu'
import Popup from '../Popup/Popup'
import { fetchPlaylists, addVideo, removeVideoFromPlaylist } from '../../features/playlists/playlists'
import { removeVideo } from '../../features/videos/channelVideos'
import VideoFormPage from '../VideoFormPage/VideoFormPage'
import './css/Videos.css'
import axios from 'axios'
import PlaylistsCheckbox from '../Playlists/PlaylistsCheckbox'

export default function Videos({videos, isRow = true, AreOwnVideos = false}: {videos: VideosProps['values'] | undefined, isRow?: boolean, AreOwnVideos?: boolean}) {
  const videoProgress = useAppSelector(state => state.videoProgress.value)
  const [dropdown, setDropdown] = useState<number | null>(null)
  const [popup, setPopup] = useState({playlist: false, editVideo: {trigger: false, id: 0, title: '', description: '', thumbnail: '', category: '', }, delete: {trigger: false, videoID: 0, videoTitle: ''}})
  const dispatch = useAppDispatch()
  const playlists = useAppSelector(state => state.playlists)
  const currentChannelID = useAppSelector(state => state.currentChannel.values?.id)
  const user = useAppSelector(state => state.user)
  const [chosenVideo, setChosenVideo] = useState(0)

  useEffect(() => {
    if (!user.isLoggedIn) return
    dispatch(fetchPlaylists(currentChannelID))
  },[dispatch, currentChannelID, user.isLoggedIn, chosenVideo])

  function handlePlaylistPopup(videoID: number){
    setPopup(prev => {return{...prev, playlist: true}})
    setDropdown(null)
    setChosenVideo(videoID)
  }




  function handleRemoveVideo(videoID: number){
    axios.delete(`/api/removeVideo?id=${videoID}`)
    .then(response => {
        if (response.status === 200){
            dispatch(removeVideo(videoID))
            setPopup(prev => ({...prev, delete: {...prev.delete, trigger: false}}))
            alert('Video removed')
        }
    })
  }

  return videos ? (
    <>
        <Popup trigger = {popup.playlist} switchOff = {() => setPopup(prev => {return{...prev, playlist: false}})}>
            <h2>Add to playlist:</h2>
            <hr className = 'mt-0-mb-4'/>
          <PlaylistsCheckbox playlists = {playlists?.values} chosenVideoID = {chosenVideo}/>
        </Popup>

        <Popup trigger = {popup.editVideo.trigger} switchOff = {() => setPopup(prev => ({...prev, editVideo: {...prev.editVideo, trigger: false}}))}>
            <VideoFormPage currentID = {popup.editVideo.id} currentTitle = {popup.editVideo.title} currentDescription = {popup.editVideo.description} currentThumbnail = {popup.editVideo.thumbnail} currentCategory = {popup.editVideo.category} popupOff = {() => setPopup(prev => ({...prev, editVideo: {...prev.editVideo, trigger: false}}))}/>
        </Popup>

        <Popup trigger = {popup.delete.trigger} switchOff = {() => setPopup(prev => ({...prev, delete: {...prev.delete, trigger: false}}))}>
            <div style = {{textAlign: 'center'}}>
                <p>Are you sure you want to delete '{popup.delete.videoTitle}' ?</p>
                    <button onClick = {() => handleRemoveVideo(popup.delete.videoID)}>Yes</button>
                    <button onClick = {() => setPopup(prev => ({...prev, delete: {...prev.delete, trigger: false}}))}>No</button>
            </div>
        </Popup>
        
       {videos?.length ? 
       <>
          <section className = {`videosContainer ${isRow ? 'row' : 'col videosCol'} `}>
                {videos?.map((video, index) =>{
                return (
                    <div className = 'videoContainer' key = {index}>
                        <Link to = {`/video/${video.id}`} >
                            <div className = 'thumbnailContainer'>
                            <ReactPlayer width = '200px' height = '100px' url = {video.pathName ? `/storage/${video.pathName}`: ''} light = {video.thumbnail ? `/storage/${video.thumbnail}` : false} playIcon = {<></>}/>
                            <p className = 'duration'>{video.length}</p>
                            </div>
                        </Link>
                    
                        <KebabMenu current = {dropdown} many = {true} index = {index} switchOn = {() => setDropdown(index)} switchOff = {() => setDropdown(null)}>
                            <div onClick = {() => handlePlaylistPopup(video.id)}>
                                <button className = 'dropdownBtn'>Save</button>
                                <button className = 'dropdownBtn'>Add to playlist</button>
                            </div>
                            {AreOwnVideos ? 
                            <>
                                <button className = 'dropdownBtn' onClick = {() => {setPopup(prev => ({...prev, editVideo: {...prev.editVideo, trigger: true, id: video.id, title: video.title, description: video.description, thumbnail: video.thumbnail, category: video.category}}));setDropdown(null)}}>Edit</button>
                                <button className = 'dropdownBtn redText' onClick = {() => {setPopup(prev => ({...prev, delete: {...prev.delete, trigger: true, videoID: video.id, videoTitle: video.title}})); setDropdown(null)}}>Remove</button>
                            </>
                            : null}
                        </KebabMenu>

                        <Link to = {`/video/${video.id}`} key = {index}>
                            <div className = 'description'>
                                <b>{video.title}</b>
                                <div className = 'smallGray'>
                                    <div className = 'logoSection row'>
                                    {video.channel?.logo ? <img className = 'videoChannelLogo' src = {`/storage/${video.channel?.logo}`} alt = ''/> : null}
                                        <p>{video.channel?.name}</p>
                                    </div>
                                
                                    {video.views} views
                                    - {video.created_at.slice(0, 10)}
                                </div>
                            </div>
                        </Link>
                    </div>
                )
                })}
                {AreOwnVideos && videoProgress > 0 ? 
                    <div className = 'thumbnail skeleton center'>
                        <p>Progress - {videoProgress}</p>
                    </div>
                : null}
              
            </section>
        </>
        :
        <>
      
        <p>No videos posted...</p>
        {AreOwnVideos ? <Link to = '/upload'><button>Upload</button></Link> : null}
        </>}
    </>
  ) : <p>Loading...</p>
  
}

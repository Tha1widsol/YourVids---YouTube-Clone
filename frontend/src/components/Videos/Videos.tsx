import React,{useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { VideosProps } from '../../features/videos/types/VideoProps'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import ReactPlayer from 'react-player'
import KebabMenu from '../KebabMenu/KebabMenu'
import Popup from '../Popup/Popup'
import { fetchPlaylists, addVideo, removeVideo } from '../../features/playlists/playlists'
import './css/Videos.css'
import axios from 'axios'

export default function Videos({videos, isRow = true, AreOwnVideos = false}: {videos: VideosProps['values'] | undefined, isRow?: boolean, AreOwnVideos?: boolean}) {
  const videoProgress = useAppSelector(state => state.videoProgress.value)
  const [dropdown, setDropdown] = useState<number | null>(null)
  const [popup, setPopup] = useState({playlist: false, delete: {trigger: false, videoID: 0, videoTitle: ''}})
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

  function handleToggleAddToPlaylist(playlistID: number){
    axios.post(`/api/addToPlaylist?videoID=${chosenVideo}&playlistID=${playlistID}`)
    .then(response => {
        if (response.status === 200){
            const video = response.data
            dispatch(addVideo({
                id: playlistID,
                video: video
            }))
        }
    })
  }

  function handleRemoveFromPlaylist(playlistID: number){
    axios.delete(`/api/removeFromPlaylist?videoID=${chosenVideo}&playlistID=${playlistID}`)
    .then(response => {
        if (response.status === 200){
            dispatch(removeVideo({
                id: playlistID,
                videoID: chosenVideo
            }))
        }
    })
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
           {playlists.values?.map((playlist, index) => {
            return (
                <div key = {index}>
                    <div className = 'row' style = {{alignItems: 'center', gap: '10px'}}>
                        <p>{playlist.title}</p>
                        <input type = 'checkbox' defaultChecked = {playlist.videos.filter(vid => vid.id === chosenVideo).length > 0} onChange = {e => e.target.checked ? handleToggleAddToPlaylist(playlist.id) : handleRemoveFromPlaylist(playlist.id)}/>
                    </div>
                </div>
            )
           })}
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
                            {!AreOwnVideos ? <button className = 'dropdownBtn redText' onClick = {() => {setPopup(prev => ({...prev, delete: {...prev.delete, trigger: true, videoID: video.id, videoTitle: video.title}})); setDropdown(null)}}>Remove</button> : null}
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

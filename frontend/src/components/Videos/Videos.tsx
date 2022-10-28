import React,{useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { VideosProps } from '../../features/videos/types/VideoProps'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import ReactPlayer from 'react-player'
import KebabMenu from '../KebabMenu/KebabMenu'
import Popup from '../Popup/Popup'
import { fetchPlaylists } from '../../features/playlists/playlists'
import './css/Videos.css'
import axios from 'axios'

export default function Videos({videos, isRow = true, isOwnVideos = false}: {videos: VideosProps['values'] | undefined, isRow?: boolean, isOwnVideos?: boolean}) {
  const videoProgress = useAppSelector(state => state.videoProgress.value)
  const [dropdown, setDropdown] = useState<number | null>(null)
  const [popup, setPopup] = useState({playlist: false})
  const dispatch = useAppDispatch()
  const playlists = useAppSelector(state => state.playlists)
  const currentChannelID = useAppSelector(state => state.currentChannel.values?.id)
  const user = useAppSelector(state => state.user)
  const [chosenVideo, setChosenVideo] =  useState(0)

  useEffect(() => {
    if (!user.isLoggedIn) return
    dispatch(fetchPlaylists(currentChannelID))
  },[dispatch])

  function handlePlaylistPopup(videoID: number){
    setPopup(prev => {return{...prev, playlist: true}})
    setDropdown(null)
    setChosenVideo(videoID)
  }

  function handleToggleAddToPlaylist(playlistID: number){
    axios.post(`/api/addToPlaylist?videoID=${chosenVideo}&playlistID=${playlistID}`)
    .then(response => {
        if (response.status === 200){
            console.log('Saved to playlist')
        }
    })
  }

  function handleRemoveFromPlaylist(playlistID: number){
    axios.delete(`/api/removeFromPlaylist?videoID=${chosenVideo}&playlistID=${playlistID}`)
    .then(response => {
        if (response.status === 200){
            console.log('Removed from playlist')
        }
    })
  }

  
  return videos ? (
    <>
        <Popup trigger = {popup.playlist} switchOff = {() => setPopup(prev => {return{...prev, playlist: false}})}>
           {playlists.values?.map((playlist, index) => {
            return (
                <div key = {index}>
                    <h2>Add to playlist:</h2>
                    <hr className = 'mt-0-mb-4'/>
                    <div className = 'row' style = {{alignItems: 'center', gap: '10px'}}>
                         <p>{playlist.title}</p>
                         <input type = 'checkbox' onChange = {e => e.target.checked ? handleToggleAddToPlaylist(playlist.id) : handleRemoveFromPlaylist(playlist.id)}/>
                    </div>
                   
                </div>
            )
           })}
        </Popup>
        
       {videos?.length ? 
       <>
          <section className = {`videosContainer ${isRow ? 'row' : 'col'} `}>
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
                            <button className = 'dropdownBtn'>Save</button>
                            <button className = 'dropdownBtn' onClick = {() => handlePlaylistPopup(video.id)}>Add to playlist</button>
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

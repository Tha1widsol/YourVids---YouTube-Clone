import React,{useState, useEffect} from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchChannelVideos } from '../../features/videos/channelVideos'
import './css/ChannelVideosPage.css'
import Videos from '../Videos/Videos'
import { fetchCurrentChannel } from '../../features/channels/currentChannel'
import PlaylistForm from '../PlaylistForm/PlaylistForm'
import Popup from '../Popup/Popup'

export default function ChannelVideosPage() {
  const dispatch = useAppDispatch()
  const currentChannel = useAppSelector(state => state.currentChannel)
  const videos = useAppSelector(state => state.channelVideos)
  const [popup, setPopup] = useState({playlist: false})

  useEffect(() => {
    dispatch(fetchCurrentChannel())
    dispatch(fetchChannelVideos(currentChannel.values?.id))
  },[dispatch, currentChannel.values?.id])
  
  return (
    <div>
      <h2>Your videos:</h2>
      <button onClick = {() => setPopup(prev => {return{...prev, playlist: true}})}>Add playlist</button>
      <Popup trigger = {popup.playlist} switchOff = {() => setPopup(prev => {return{...prev, playlist: false}})} modalOn = {false}>
        <PlaylistForm popupOff = {() => setPopup(prev => {return{...prev, playlist: false}})}/>
      </Popup>

      <Videos videos = {videos.values} isRow = {false} AreOwnVideos = {true}/>
    </div>
  )
}

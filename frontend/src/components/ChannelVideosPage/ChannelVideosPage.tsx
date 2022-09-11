import React,{useEffect} from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchChannelVideos } from '../../features/videos/channelVideos'
import './css/ChannelVideosPage.css'
import Videos from '../Videos/Videos'

export default function ChannelVideosPage() {
  const dispatch = useAppDispatch()
  const currentChannel = useAppSelector(state => state.currentChannel)
  const videos = useAppSelector(state => state.channelVideos)

  useEffect(() => {
    dispatch(fetchChannelVideos(currentChannel.values?.id))
  },[dispatch, currentChannel.values?.id])
  
  return (
    <div>
      <h2>Your videos:</h2>
      <Videos videos = {videos.values} isRow = {false} isOwnVideos = {true}/>
    </div>
  )
}

import React,{useEffect} from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchHomeVideos } from '../../features/videos/homeVideos'
import Videos from '../Videos/Videos'
import '../ChannelVideosPage/css/ChannelVideosPage.css'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const videos = useAppSelector(state => state.homeVideos)

  useEffect(() => {
    dispatch(fetchHomeVideos())
  },[dispatch])

  return (
    <div>
        <Videos videos = {videos.values}/>
    </div>
  )
  
}


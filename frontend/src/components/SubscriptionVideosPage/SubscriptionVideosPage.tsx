import React,{useEffect} from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import Videos from '../Videos/Videos'
import { fetchSubscriptionVideos } from '../../features/videos/subscriptionVideos'

export default function SubscriptionVideosPage() {
  const dispatch = useAppDispatch()
  const videos = useAppSelector(state => state.subscriptionVideos)

  useEffect(() => {
    dispatch(fetchSubscriptionVideos())
  },[dispatch])

  return (
    <div>
        <h3><b>Today</b></h3>
       <Videos videos = {videos.values}/>
    </div>
  )
}

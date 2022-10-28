import React,{useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchPlaylistVideos } from '../../features/videos/playlistVideos'
import Videos from '../Videos/Videos'

export default function PlaylistPage() {
    const dispatch = useAppDispatch()
    const {playlistID} = useParams()
    const videos = useAppSelector(state => state.playlistVideos)

    useEffect(() => {
      dispatch(fetchPlaylistVideos(playlistID))
    },[dispatch, playlistID])

  return (
    <div>
        <Videos videos = {videos.values}/>
    </div>
  )
}

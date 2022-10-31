import React,{useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchPlaylist } from '../../features/playlists/playlist'
import Videos from '../Videos/Videos'

export default function PlaylistPage() {
    const dispatch = useAppDispatch()
    const {playlistID} = useParams()
    const playlist = useAppSelector(state => state.playlist.values)

    useEffect(() => {
      dispatch(fetchPlaylist(playlistID))
    },[dispatch, playlistID])

  return (
    <div>
        <div className = 'row' style = {{gap: '10px'}}>
           <h2>{playlist.title}</h2>
           <button>Edit</button>
        </div>
       
         <p>{playlist.description}</p>
         <p className = 'smallGray'>Videos: {playlist.videoCount}</p>
         <p className = 'smallGray'>Visibilty: {playlist.visibility}</p>
         <hr className = 'mt-0-mb-4'/>
        <Videos videos = {playlist.videos}/>
    </div>
  )
}

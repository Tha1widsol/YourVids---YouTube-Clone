import React,{useState, useEffect} from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchChannel } from '../../features/channels/channel'
import { fetchPlaylists } from '../../features/playlists/playlists'
import axios from 'axios'
import { PlaylistsProps } from '../../features/playlists/types/playlistsProps'
import { removeVideoFromPlaylist } from '../../features/playlists/playlists'
import { addVideo } from '../../features/playlists/playlists'

export default function PlaylistsCheckbox({playlists, chosenVideoID} : {playlists: PlaylistsProps['values'], chosenVideoID?: number}) {
    const dispatch = useAppDispatch()
    const channel = useAppSelector(state => state.currentChannel)
    const user = useAppSelector(state => state.user)
 
    useEffect(() => {
       if (channel.status === 'rejected' || !user.isLoggedIn) return
        dispatch(fetchPlaylists(channel.values?.id))
    },[dispatch])

    function handleRemoveFromPlaylist(playlistID: number){
      axios.delete(`/api/removeFromPlaylist?videoID=${chosenVideoID}&playlistID=${playlistID}`)
      .then(response => {
          if (response.status === 200){
              dispatch(removeVideoFromPlaylist({
                  id: playlistID,
                  videoID: chosenVideoID
              }))
          }
      })
    }
  

    function handleToggleAddToPlaylist(playlistID: number){
      axios.post(`/api/addToPlaylist?videoID=${chosenVideoID}&playlistID=${playlistID}`)
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

  return (
    <>
        <h4>Save to...</h4>
        <hr className = 'mt-0-mb-4'/>

        {playlists.map((playlist, index) => {
            return (
                <div key = {index}>
                    <div className = 'row' style = {{alignItems: 'center'}}>
                    <input type = 'checkbox' defaultChecked = {playlist.videos.filter(vid => vid.id === chosenVideoID).length > 0} onChange = {e => e.target.checked ? handleToggleAddToPlaylist(playlist.id) : handleRemoveFromPlaylist(playlist.id)}/>
                      <p>{playlist.title}</p>
                    </div>
                </div>
            )
        })}
    </>
  )
}

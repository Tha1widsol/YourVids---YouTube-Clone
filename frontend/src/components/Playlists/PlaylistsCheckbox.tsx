import React,{useState, useEffect} from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchChannel } from '../../features/channels/channel'
import { fetchPlaylists } from '../../features/playlists/playlists'

export default function PlaylistsCheckbox() {
    const dispatch = useAppDispatch()
    const playlists = useAppSelector(state => state.playlists)
    const channel = useAppSelector(state => state.currentChannel)
    const user = useAppSelector(state => state.user)
    const [selectedChannelID, setSelectedChannelID] = useState('')

    useEffect(() => {
       if (channel.status === 'rejected' || !user.isLoggedIn) return
        dispatch(fetchPlaylists(channel.values?.id))
    },[dispatch])

    function handleCheckedBox(e: React.ChangeEvent<HTMLInputElement>){
        if (e.target.checked) setSelectedChannelID(e.target.value)
        else setSelectedChannelID('')
    }

  return (
    <>
        <h4>Save to...</h4>
        <hr className = 'mt-0-mb-4'/>

        {playlists.values?.map((playlist, index) => {
            return (
                <div key = {index}>
                    <div className = 'row' style = {{alignItems: 'center'}}>
                      <input type = 'checkbox' value = {playlist.id} onChange = {handleCheckedBox}/>
                      <p>{playlist.title}</p>
                    </div>
                </div>
            )
        })}
    </>
  )
}

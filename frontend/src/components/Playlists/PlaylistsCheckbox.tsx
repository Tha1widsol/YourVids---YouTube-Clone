import React,{useState, useEffect} from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchPlaylists } from '../../features/playlists/playlists'

export default function PlaylistsCheckbox() {
    const dispatch = useAppDispatch()
    const playlists = useAppSelector(state => state.playlists)
    const channelID = useAppSelector(state => state.currentChannel.values.id)
    const [selectedChannelID, setSelectedChannelID] = useState('')

    useEffect(() => {
        dispatch(fetchPlaylists(channelID))
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

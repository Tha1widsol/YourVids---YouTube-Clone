import React,{useEffect} from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchPlaylists } from '../../features/playlists/playlists'

export default function Playlists({channelID}: {channelID: string | number | undefined }) {
    const playlists = useAppSelector(state => state.playlists)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchPlaylists(channelID))
    },[dispatch, channelID])
    
  return (
    <>
        {playlists.status === 'success' ?
                playlists.values?.map((playlist, index) => {
                    return (
                        <div key = {index}>
                            <p>{playlist.title}</p>
                        </div>
                    )
                })

        : playlists.status === 'loading' ? <p>Loading...</p>

    : <p>No playlists found...</p>}
        
    </>
  )
}

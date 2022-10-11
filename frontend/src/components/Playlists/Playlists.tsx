import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import { PlaylistsProps } from '../../features/playlists/types/playlistsProps'
import './css/Playlists.css'

export default function Playlists({playlists, isRow = true, areOwnPlaylists = false}: {playlists: PlaylistsProps['values'], isRow?: boolean, areOwnPlaylists?: boolean}) {

  return playlists ? (
    <>
        {playlists?.length ? 
        <section className = {`playlistsContainer ${isRow ? 'row' : 'col'} `}>
            {playlists.map((playlist, index) => {
                return (
                    <div className = 'playlistContainer' key = {index}>
                      <Link to = {`/playlist/${playlist.id}`}>
                          <p>{playlist.title}</p>
                          <p className = 'smallGray'>Videos - {playlist.videoCount}</p>
                      </Link>
                    </div>
                )
            })}

        </section>
        : <p>No playlists created...</p>}
        
    </>
  ): <p>Loading...</p>
}

import React from 'react'
import { useParams } from 'react-router-dom'

export default function PlaylistPage() {
    const {playlistID} = useParams()

  return (
    <div>
        PlaylistPage
    </div>
  )
}

import React from 'react'
import {useGetChannelQuery} from '../../features/channels/channels'
import {useParams} from 'react-router-dom'

export default function ChannelPage() {
    const {channelID} = useParams()
    const channel = useGetChannelQuery(channelID || '')
    
  return (
    <div>
        <h1>{channel.data?.name}</h1>
    </div>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
import { ChannelsProps } from '../../features/channels/types/ChannelProps'
import './css/Channels.css'

export default function Channels({channels, isRow = false}: {channels: ChannelsProps['values'] | undefined, isRow?: boolean}) {
  return channels ? (
    <div className = {isRow ? 'row' : 'col'}>
       {channels.map((channel, index) => {
        return (
            <Link to = {`/channel/${channel.id}`} key = {index}>
                <div className = 'channel row'>
                    {channel.logo ? <img className = 'logo' src = {`/storage/${channel.logo}`} alt = ''/> : null}

                    <div className = 'col'>
                        {channel.name}
                        <p className = 'smallGray'>{channel.subscribers} subscribers</p>
                    </div>
                </div>
            </Link>
        )
       })}
    </div>
  ) : <p>Loading...</p>
}

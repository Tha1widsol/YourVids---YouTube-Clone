import React from 'react'
import { Link } from 'react-router-dom';
import { useQuery } from '../../app/hooks';
import './css/Navbar.css';
import './css/ChannelNavbar.css';

export default function ChannelNavbar() {
  const query = useQuery()
  const tab = query.get('tab')

  return (
    <div className = 'nav channelNav'>
        <Link to = '?tab=featured' className = {tab === 'featured' ? 'active' : ''}>Home</Link>
        <Link to = '?tab=videos' className = {tab === 'videos' ? 'active' : ''}>Videos</Link>
        <Link to = '?tab=playlists' className = {tab === 'playlists' ? 'active' : ''}>Playlists</Link>
    </div>
  )
}

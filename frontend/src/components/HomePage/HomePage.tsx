import React from 'react'
import {useAppSelector} from '../../app/hooks'

export default function HomePage() {
  const user = useAppSelector(state => state.user)

  return (
    <div>
      {user.isLoggedIn ? 
        <p>Welcome, {user.values?.username}</p> 
        : <h1>Welcome to YourVids</h1>}
    </div>
  )
}

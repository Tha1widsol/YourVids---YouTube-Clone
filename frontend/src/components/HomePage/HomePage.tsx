import React from 'react'
import {useAppSelector} from '../../app/hooks'

export default function HomePage() {
  const user = useAppSelector(state => state.user)
 console.log(user)


  return (
    <div>
      <p>Welcome, {user.values?.username}</p> 
    </div>
  )
}

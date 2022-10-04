import React,{useState, useEffect} from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import {useNavigate} from 'react-router-dom'
import { setSubscribers } from '../../features/channels/channel'
import { ChannelProps } from '../../features/channels/types/ChannelProps'
import { fetchCurrentChannel } from '../../features/channels/currentChannel'
import './css/Subscribe.css'
import axios from 'axios'

export default function Subscribe({channel}: {channel: ChannelProps['values']}) {
    const [alreadySubscribed, setAlreadySubscribed] = useState(false)
    const user = useAppSelector(state => state.user)
    const currentChannel = useAppSelector(state => state.currentChannel)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {
    if (!user.isLoggedIn) return
     dispatch(fetchCurrentChannel())

     axios.get(`/api/checkSubscribed?id=${channel.id}`)
     .then(response => {
        const data = response.data
        if (data.subscribed) setAlreadySubscribed(true)
      })

    },[user.isLoggedIn, channel.id])

    function handleToggleSubscribe(isSubscribing = true){
        if (!user.isLoggedIn || currentChannel.status === 'rejected') {
          navigate('/login')
          return
        }

        const requestOptions = {
            headers: {'Content-Type': 'multipart/form-data'}
        }

        axios.put(`/api/${isSubscribing ? 'subscribe' : 'unsubscribe'}?id=${channel.id}`,null, requestOptions)
        .then(response => {
          if (response.status === 200) {
            if (isSubscribing){
              setAlreadySubscribed(true)
              dispatch(setSubscribers(channel.subscribers + 1))
              return 
            }
            setAlreadySubscribed(false)
            dispatch(setSubscribers(channel.subscribers - 1))
          }
        })

    }

  return (
    !alreadySubscribed ? 
    <button type = 'button' onClick = {() => handleToggleSubscribe()}>Subscribe</button> 
    : <button type = 'button' className = 'unsubscribe' onClick = {() => handleToggleSubscribe(false)}>Unsubscribe</button>
  )
}

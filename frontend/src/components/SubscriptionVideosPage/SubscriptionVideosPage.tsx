import React,{useEffect} from 'react'
import axios from 'axios'

export default function SubscriptionVideosPage() {
  useEffect(() => {
    axios.get('/api/getSubscriptionVideos').
    then(response => {
      console.log(response.data)
    })
  },[])
  
  return (
    <div>
        SubscriptionVideosPage
    </div>
  )
}

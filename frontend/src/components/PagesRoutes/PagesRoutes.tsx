import React from 'react'
import {Routes,Route} from 'react-router-dom'
import HomePage from '../HomePage/HomePage'
import RegisterPage from '../RegisterPage/RegisterPage'
import LoginPage from '../LoginPage/LoginPage'
import UserChannels from '../UserChannels/UserChannels'
import ChannelPage from '../ChannelPage/ChannelPage'
import {CheckAuth} from '../ProtectedRoutes/ProtectedRoutes'
import VideoFormPage from '../VideoFormPage/VideoFormPage'
import VideoPage from '../VideoPage/VideoPage'
import ChannelVideosPage from '../ChannelVideosPage/ChannelVideosPage'
import SubscriptionVideosPage from '../SubscriptionVideosPage/SubscriptionVideosPage'

export default function PagesRoutes() {
  return (
    <div>
        <Routes>
            <Route path = '/' element = {<HomePage/>}/>
            <Route path = '/home' element = {<HomePage/>}/>
            <Route path = '/channel/:channelID' element = {<ChannelPage/>}/>
            <Route path = '/video/:videoID' element = {<VideoPage/>}/>


            <Route element = {<CheckAuth/>}>
              <Route path = '/user/:username/channels' element = {<UserChannels/>}/>
              <Route path = '/upload' element = {<VideoFormPage/>}/>
              <Route path = '/videos' element = {<ChannelVideosPage/>}/>
              <Route path = '/subscriptions' element = {<SubscriptionVideosPage/>}/>
            </Route>

            <Route element = {<CheckAuth checkAuth = {false}/>}>
                <Route path = '/register' element = {<RegisterPage/>}/>
                <Route path = '/login' element = {<LoginPage/>}/>
            </Route>

        </Routes>
    </div>
  )
}

import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux"
import {
    persistReducer
  } from 'redux-persist'
import userReducer from '../features/Auth/auth'
import VideoProgressReducer from '../features/videos/videoProgress'
import channelsReducer from '../features/channels/channels'
import channelReducer from '../features/channels/channel'
import  currentChannelReducer from '../features/channels/currentChannel'
import videoReducer from '../features/videos/video'
import channelVideosReducer from '../features/videos/channelVideos'
import subscriptionVideosReducer from '../features/videos/subscriptionVideos'
import homeVideosReducer from '../features/videos/homeVideos'
import channelSubscribersReducer from '../features/channels/channelSubscribers'
import likedVideosReducer from '../features/videos/likedVideos'
import { channelSubscribersApi } from '../features/channels/getSubscribers'
import playlistsReducer from '../features/playlists/playlists'
import playlistReducer from '../features/playlists/playlist'
import storage from 'redux-persist/lib/storage'

  const persistConfig = {
    key: 'root',
    version: 1,
    whitelist: ['user', 'currentChannel'],
    storage,
  }
  
  const reducers = combineReducers({
    user: userReducer,
    videoProgress: VideoProgressReducer,
    channel: channelReducer,
    channels: channelsReducer,
    currentChannel: currentChannelReducer,
    channelSubscribers: channelSubscribersReducer,
    channelVideos: channelVideosReducer,
    subscriptionVideos: subscriptionVideosReducer,
    video: videoReducer,
    homeVideos: homeVideosReducer,
    likedVideos: likedVideosReducer,
    [channelSubscribersApi.reducerPath]: channelSubscribersApi.reducer,
    playlists: playlistsReducer,
    playlist: playlistReducer
  })

  const persistedReducer = persistReducer(persistConfig, reducers)

  export const store = configureStore({
        reducer: persistedReducer,
        devTools: process.env.NODE_ENV !== 'production',
        middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          immutableCheck: false,
          serializableCheck: false
        }).concat([
          channelSubscribersApi.middleware
        ]),
      
    })
      
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
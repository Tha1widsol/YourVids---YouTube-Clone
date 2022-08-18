import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux"
import {
    persistReducer
  } from 'redux-persist'
import userReducer from '../features/Auth/auth'
import {channelsApi} from '../features/channels/channels'
import { channelApi } from '../features/channels/channel'
import { currentChannelApi } from '../features/channels/currentChannel'
import { videoApi } from '../features/videos/video'
import storage from 'redux-persist/lib/storage'

  const persistConfig = {
    key: 'root',
    version: 1,
    blacklist: [channelsApi.reducerPath, channelApi.reducerPath, videoApi.reducerPath, currentChannelApi.reducerPath],
    storage,
  }
  
  const reducers = combineReducers({
    user: userReducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [channelApi.reducerPath]: channelApi.reducer,
    [currentChannelApi.reducerPath]: currentChannelApi.reducer,
    [videoApi.reducerPath]: videoApi.reducer
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
          channelsApi.middleware, 
          currentChannelApi.middleware, 
          channelApi.middleware,
          videoApi.middleware
        ]),
      
    })
      
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux"
import {
    persistReducer
  } from 'redux-persist'
import userReducer from '../features/Auth/auth'
import {channelsApi, channelApi} from '../features/channels/channels'
import storage from 'redux-persist/lib/storage'

  const persistConfig = {
    key: 'root',
    version: 1,
    blacklist: [channelsApi.reducerPath, channelApi.reducerPath],
    storage,
  }
  
  const reducers = combineReducers({
    user: userReducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [channelApi.reducerPath]: channelApi.reducer
  })

  const persistedReducer = persistReducer(persistConfig, reducers)

  export const store = configureStore({
        reducer: persistedReducer,
        devTools: process.env.NODE_ENV !== 'production',
        middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          immutableCheck: false,
          serializableCheck: false
        }),
      
    })
      
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
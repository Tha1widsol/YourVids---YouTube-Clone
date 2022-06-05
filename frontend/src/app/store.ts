import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux"
import {
    persistReducer
  } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

  const persistConfig = {
    key: 'root',
    version: 1,
    blacklist: [],
    storage,
  }
  
  const reducers = combineReducers({})

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
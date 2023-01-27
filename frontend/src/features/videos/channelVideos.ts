import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { VideosProps } from './types/VideoProps';
import axios from 'axios';

const initialState = {
    values: [{
        channel: {
            id: 0,
            name: '',
            description: '',
            subscribers: 0,
            views: 0,
            logo: '',
            banner: '',
            created_at: '',
            active: false
        },
        id: 0,
        title: '',
        description: '',
        views: 0,
        likes: 0,
        dislikes: 0,
        thumbnail: '',
        category: '',
        length: '',
        pathName: '',
        created_at: ''
    }],
    status: ''
} as VideosProps

export const fetchChannelVideos = createAsyncThunk(
    'videos/fetchChannelVideos',
    async (id: string | number | undefined) => {
        const response = await axios.get(`/api/getChannelVideos?id=${id}`)
        return response.data
    }
)

export const channelVideosSlice = createSlice({
    name: 'channelVideos',
    initialState,
    reducers: {
        setVideos: (state, action) => {
            state.values = action.payload
        },

        editVideo: (state, action) => {
            const idx = state.values.findIndex(video => video.id === action.payload.id)
            state.values[idx].title = action.payload.title
            state.values[idx].description = action.payload.description
            state.values[idx].thumbnail = action.payload.thumbnail
            state.values[idx].category = action.payload.category
            
        },

        removeVideo: (state, action) => {
            const id = state.values.findIndex(video => video.id === action.payload)
            state.values.splice(id, 1)
        },

    },

    extraReducers(builder){
        builder
            .addCase(fetchChannelVideos.pending, (state) => {
                state.status = 'loading'
            })
            
            .addCase(fetchChannelVideos.fulfilled, (state, action) => {
                state.status = 'success'
                state.values = action.payload
            })

            .addCase(fetchChannelVideos.rejected, (state) => {
                state.status = 'rejected'
            })
    }

})

export const {setVideos, editVideo, removeVideo} = channelVideosSlice.actions
export default channelVideosSlice.reducer
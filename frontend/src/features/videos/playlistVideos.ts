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

export const fetchPlaylistVideos = createAsyncThunk(
    'videos/fetchPlaylistVideos',
    async (id: string | number | undefined) => {
        const response = await axios.get(`/api/getPlaylistVideos?id=${id}`)
        return response.data
    }
)

export const PlaylistVideosSlice = createSlice({
    name: 'PlaylistVideos',
    initialState,
    reducers: {
        setVideos: (state, action) => {
            state.values = action.payload
        },
    },

    extraReducers(builder){
        builder
            .addCase(fetchPlaylistVideos.pending, (state) => {
                state.status = 'loading'
            })
            
            .addCase(fetchPlaylistVideos.fulfilled, (state, action) => {
                state.status = 'success'
                state.values = action.payload
            })

            .addCase(fetchPlaylistVideos.rejected, (state) => {
                state.status = 'rejected'
            })
    }

})

export const {setVideos} = PlaylistVideosSlice.actions
export default PlaylistVideosSlice.reducer
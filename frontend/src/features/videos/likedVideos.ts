import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { LikedDislikedVideosProps } from './types/VideoProps';
import axios from 'axios';

const initialState = {
    values: [{
        id: 0,
        liked: false,
        disliked: false,
        created_at: '',

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
        video: {
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
        }
    }],
    status: ''
} as LikedDislikedVideosProps

export const fetchLikedVideos = createAsyncThunk(
    'videos/fetchLikedVideos',
    async (id: string | number | undefined) => {
        const response = await axios.get(`/api/getLikedVideos?id=${id}`)
        return response.data
    }
)

export const likedVideosSlice = createSlice({
    name: 'likedVideos',
    initialState,
    reducers: {
        setVideos: (state, action) => {
            state.values = action.payload
        },

        addVideo: (state, action) => {
            state.values.push(action.payload)
        },

        removeVideo: (state, action) => {
            state.values.splice(state.values.findIndex(video => video.id === action.payload))
        }
    },

    extraReducers(builder){
        builder
            .addCase(fetchLikedVideos.pending, (state) => {
                state.status = 'loading'
            })
            
            .addCase(fetchLikedVideos.fulfilled, (state, action) => {
                state.status = 'success'
                state.values = action.payload
            })

            .addCase(fetchLikedVideos.rejected, (state) => {
                state.status = 'rejected'
            })
    }

})

export const {setVideos, addVideo, removeVideo} = likedVideosSlice.actions
export default likedVideosSlice.reducer
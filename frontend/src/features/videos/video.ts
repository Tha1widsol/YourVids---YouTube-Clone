import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { VideoProps } from './types/VideoProps';
import axios from 'axios';

const initialState = {
    values: {
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
    },
    status: ''
} as VideoProps

export const fetchVideo = createAsyncThunk(
    'videos/fetchVideoById',
    async (id: string | number | undefined) => {
        const response = await axios.get(`/api/getVideo?id=${id}`)
        return response.data
    }
)

export const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        setVideo: (state, action) => {
            state.values = action.payload
        },

        incrementViews: (state) => {
            state.values.views += 1
        },

        setLikes: (state, action) => {
            state.values.likes = action.payload
        },

        setDislikes: (state, action) => {
            state.values.dislikes = action.payload
        }
    },

    extraReducers(builder){
        builder
            .addCase(fetchVideo.pending, (state) => {
                state.status = 'loading'
            })
            
            .addCase(fetchVideo.fulfilled, (state, action) => {
                state.status = 'success'
                state.values = action.payload
            })

            .addCase(fetchVideo.rejected, (state) => {
                state.status = 'rejected'
            })
    }

})

export const {setVideo, incrementViews, setLikes, setDislikes} = videoSlice.actions
export default videoSlice.reducer
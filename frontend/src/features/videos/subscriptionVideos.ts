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

export const fetchSubscriptionVideos = createAsyncThunk(
    'videos/fetchSubscriptionVideos',
    async () => {
        const response = await axios.get(`/api/getSubscriptionVideos`)
        return response.data
    }
)

export const SubscriptionVideosSlice = createSlice({
    name: 'subscriptionVideos',
    initialState,
    reducers: {
        setVideos: (state, action) => {
            state.values = action.payload
        },
    },

    extraReducers(builder){
        builder
            .addCase(fetchSubscriptionVideos.pending, (state) => {
                state.status = 'loading'
            })
            
            .addCase(fetchSubscriptionVideos.fulfilled, (state, action) => {
                state.status = 'success'
                state.values = action.payload
            })

            .addCase(fetchSubscriptionVideos.rejected, (state) => {
                state.status = 'rejected'
            })
    }

})

export const {setVideos} = SubscriptionVideosSlice.actions
export default SubscriptionVideosSlice.reducer
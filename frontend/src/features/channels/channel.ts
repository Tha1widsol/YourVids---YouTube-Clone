import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {ChannelProps} from './types/ChannelProps';
import axios from 'axios';

const initialState = {
    values: {
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
    status: ''
} as ChannelProps


export const fetchChannel = createAsyncThunk(
    'channel/fetchChannelById',
    async (id: string | number | undefined) => {
        const response = await axios.get(`/api/getChannel?id=${id}`)
        return response.data
    }
)

export const channelSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        setChannel: (state, action) => {
            state.values = action.payload
        },

         setSubscribers: (state, action) => {
            state.values.subscribers = action.payload
         },

         incrementViews: (state) => {
            state.values.views += 1
         }
    },

    extraReducers(builder){
        builder
            .addCase(fetchChannel.pending, (state) => {
                state.status = 'loading'
            })
            
            .addCase(fetchChannel.fulfilled, (state, action) => {
                state.status = 'success'
                state.values = action.payload
            })

            .addCase(fetchChannel.rejected, (state) => {
                state.status = 'rejected'
            })
    }

})

export const {setChannel, setSubscribers, incrementViews} = channelSlice.actions
export default channelSlice.reducer
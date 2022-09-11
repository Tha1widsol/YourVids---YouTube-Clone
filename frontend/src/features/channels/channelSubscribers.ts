import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {ChannelsProps} from './types/ChannelProps';
import axios from 'axios';

const initialState = {
    values: [{
        id: 0,
        name: '',
        description: '',
        subscribers: 0,
        views: 0,
        logo: '',
        banner: '',
        created_at: '',
        active: false
    }],
    status: ''
} as ChannelsProps


export const fetchChannelSubscribers = createAsyncThunk(
    'channel/fetchChannelSubscriberById',
    async (id: string | number | undefined) => {
        const response = await axios.get(`/api/getSubscribers?id=${id}`)
        return response.data
    }
)

export const channelSubscribersSlice = createSlice({
    name: 'channelSubscribers',
    initialState,
    reducers: {
        setChannels: (state, action) => {
            state.values = action.payload
        },
    },

    extraReducers(builder){
        builder
            .addCase(fetchChannelSubscribers.pending, (state) => {
                state.status = 'loading'
            })
            
            .addCase(fetchChannelSubscribers.fulfilled, (state, action) => {
                state.status = 'success'
                state.values = action.payload
            })

            .addCase(fetchChannelSubscribers.rejected, (state) => {
                state.status = 'rejected'
            })
    }

})

export const {setChannels} = channelSubscribersSlice.actions
export default channelSubscribersSlice.reducer
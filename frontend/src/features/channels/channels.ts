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


export const fetchChannels = createAsyncThunk(
    'channel/fetchChannels',
    async () => {
        const response = await axios.get(`/api/userChannels`)
        return response.data
    }
)

export const channelsSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
        setChannels: (state, action) => {
            state.values = action.payload
        },
    },

    extraReducers(builder){
        builder
            .addCase(fetchChannels.pending, (state) => {
                state.status = 'loading'
            })
            
            .addCase(fetchChannels.fulfilled, (state, action) => {
                state.status = 'success'
                state.values = action.payload
            })

            .addCase(fetchChannels.rejected, (state) => {
                state.status = 'rejected'
            })
    }

})

export const {setChannels} = channelsSlice.actions
export default channelsSlice.reducer
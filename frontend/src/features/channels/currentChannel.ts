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


export const fetchCurrentChannel = createAsyncThunk(
    'channel/fetchCurrentChannel',
    async () => {
        const response = await axios.get(`/api/getCurrentChannel`)
        return response.data
    }
)

export const currentChannelSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        setChannel: (state, action) => {
            state.values = action.payload
        },

         incrementSubscribers: (state) => {
            state.values.subscribers += 1
         },

         incrementViews: (state) => {
            state.values.views += 1
         }
    },

    extraReducers(builder){
        builder
            .addCase(fetchCurrentChannel.pending, (state) => {
                state.status = 'loading'
            })
            
            .addCase(fetchCurrentChannel.fulfilled, (state, action) => {
                state.status = 'success'
                state.values = action.payload
            })

            .addCase(fetchCurrentChannel.rejected, (state) => {
                state.status = 'rejected'
            })
    }

})

export const {setChannel, incrementSubscribers, incrementViews} = currentChannelSlice.actions
export default currentChannelSlice.reducer
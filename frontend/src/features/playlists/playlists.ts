import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { PlaylistsProps } from './types/playlistsProps';
import axios from 'axios';

const initialState = {
    values: [{
        id: 0,
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
        title: '',
        description: '',
        views: 0,
        videoCount: 0,
        visibility: 'Public',
        created_at: '',
    }],
    status: ''
} as PlaylistsProps

export const fetchPlaylists = createAsyncThunk(
    'playlist/fetchPlaylists',
    async (id: number | string | undefined) => {
        const response = await axios.get(`/api/getPlaylists?id=${id}`)
        return response.data
    }
)

export const playlistsSlice = createSlice({
    name: 'playlists',
    initialState,
    reducers: {
        setPlaylists: (state, action) => {
            state.values = action.payload
        }
    },

    extraReducers(builder) {
        builder
            .addCase(fetchPlaylists.pending, (state) => {
                state.status = 'loading'
            })

            .addCase(fetchPlaylists.fulfilled, (state, action) => {
                state.status = 'success'
                state.values = action.payload
            }) 

            .addCase(fetchPlaylists.rejected, (state) => {
                state.status = 'rejected'
            })

    }
})

export const {setPlaylists} = playlistsSlice.actions
export default playlistsSlice.reducer
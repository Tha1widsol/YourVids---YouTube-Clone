import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { PlaylistProps } from './types/playlistsProps';
import axios from 'axios';

const initialState = {
    values: {
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
        videos: [{
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

        title: '',
        description: '',
        views: 0,
        videoCount: 0,
        visibility: '',
        created_at: '',
    },
    status: ''
} as PlaylistProps

export const fetchPlaylist = createAsyncThunk(
    'playlist/fetchPlaylist',
    async (id: number | string | undefined) => {
        const response = await axios.get(`/api/getPlaylist?id=${id}`)
        return response.data
    }
)

export const playlistSlice = createSlice({
    name: 'playlist',
    initialState,
    reducers: {
        setPlaylist: (state, action) => {
            state.values = action.payload
        },
        
        editPlaylist: (state, action) => {
            state.values.title = action.payload.title
            state.values.description = action.payload.description
            state.values.visibility = action.payload.visibility
        }
    },

    extraReducers(builder) {
        builder
            .addCase(fetchPlaylist.pending, (state) => {
                state.status = 'loading'
            })

            .addCase(fetchPlaylist.fulfilled, (state, action) => {
                state.status = 'success'
                state.values = action.payload
            }) 

            .addCase(fetchPlaylist.rejected, (state) => {
                state.status = 'rejected'
            })

    }
})

export const {setPlaylist, editPlaylist} = playlistSlice.actions
export default playlistSlice.reducer
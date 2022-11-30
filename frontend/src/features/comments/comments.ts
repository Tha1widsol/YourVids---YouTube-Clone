import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { CommentsProps } from './types/CommentProps';
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
        videoID: 0,
        text: '',
        likes: 0,
        dislikes: 0,
        created_at: ''
    }]
} as CommentsProps

export const fetchVideoComments = createAsyncThunk(
    'comment/fetchVideoComments',
    async (id: number | string | undefined) => {
        const response = await axios.get(`/api/getVideoComments?id=${id}`)
        return response.data
    }
)

export const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        setComments: (state, action) => {
            state.values = action.payload
        },

        addComment: (state, action) => {
            state.values.push(action.payload)
        }
    },

    extraReducers(builder){
        builder
            .addCase(fetchVideoComments.pending, (state) => {
                state.status = 'loading'
            })
            
            .addCase(fetchVideoComments.fulfilled, (state, action) => {
                state.status = 'success'
                state.values = action.payload
            })

            .addCase(fetchVideoComments.rejected, (state) => {
                state.status = 'rejected'
            })
    }

})

export const {setComments, addComment} = commentsSlice.actions
export default commentsSlice.reducer
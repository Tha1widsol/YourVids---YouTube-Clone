import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    value: 0
}

export const videoProgressSlice = createSlice({
    name: 'videoProgress',
    initialState,
    reducers: {
        setProgress: (state, action) => {
            state.value = action.payload
        }
    }
})

export const {setProgress} = videoProgressSlice.actions
export default videoProgressSlice.reducer
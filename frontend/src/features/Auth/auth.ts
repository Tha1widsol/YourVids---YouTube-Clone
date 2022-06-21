import {createAsyncThunk,createSlice} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    values:{
        id: 0,
        username: ''
    },
    isLoggedIn: false,
    status: ''
}

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
     async () => {
        try{
            if (!initialState.isLoggedIn) return
            const response = await axios.get('/api/getUser')
            return response.data
        }

      catch(error){
          window.location.reload()
      }
    }

)

export const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers: {
        login: (state) => {
            state.isLoggedIn = true
        },

        logout: (state) => {
            state.isLoggedIn = false
            state = initialState;
        }
    },

    extraReducers: {
        [fetchUser.pending.toString()]: (state) => {
            state.status = 'loading'
        },
        
        [fetchUser.fulfilled.toString()]: (state,action) => {
            state.values = action.payload
            state.status = 'success'
        },

        [fetchUser.rejected.toString()]: (state) => {
            state.status = 'rejected'
        }
    }

})

export const {login,logout} = userSlice.actions

export default userSlice.reducer
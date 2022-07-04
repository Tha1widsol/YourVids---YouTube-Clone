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
            const response = await axios.get('/api/getUser')
            return response.data
         }

      catch(error){
          return initialState
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
            state.values = initialState.values;
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
            state.isLoggedIn = false
        }
    }

})

export const {login, logout} = userSlice.actions

export default userSlice.reducer
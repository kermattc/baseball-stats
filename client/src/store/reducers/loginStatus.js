import { createSlice } from '@reduxjs/toolkit';

export const loginSlice = createSlice({
    name: 'loginStatus',
    initialState: {
        loggedIn: false,
        username: ''
    },
    reducers: {
        updateLogin: (state, action) => {
            state.loggedIn = action.payload;
        },
        updateUsername: (state, action) => {
            state.username = action.payload
        }
    }
})

export const { updateLogin, updateUsername } = loginSlice.actions;

export default loginSlice.reducer;
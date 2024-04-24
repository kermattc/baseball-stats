import { createSlice } from '@reduxjs/toolkit';

export const loginSlice = createSlice({
    name: 'loginStatus',
    initialState: {
        loggedIn: false,
        username: ''
    },
    reducers: {
        toggleLogin: (state) => {
            state.loggedIn = !state.loggedIn;
        },
        updateUsername: (state, action) => {
            state.username = action.payload
        }
    }
})

export const { toggleLogin, updateUsername } = loginSlice.actions;

export default loginSlice.reducer;
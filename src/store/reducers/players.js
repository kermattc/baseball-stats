import { createSlice } from '@reduxjs/toolkit';
import { fetchPlayersList } from '../utils/thunk';

export const playersSlice = createSlice({
    name: 'players',
    initialState: {
        loading: true,
        playersList: []
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchPlayersList.pending, (state) => {
            state.loading = true;
            console.log("fetchPlayers pending")
        })
        .addCase(fetchPlayersList.fulfilled, (state, action) => {
            state.playersList = action.payload
            state.loading = false;

            console.log('state.players: ', state.playersList)
        })
        .addCase(fetchPlayersList.rejected, (state) => {
            state.loading = false;
            console.log("fetchPlayers rejected")
        })
    }
})

export default playersSlice.reducer;
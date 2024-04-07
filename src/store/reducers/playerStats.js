import { createSlice } from '@reduxjs/toolkit';
import { fetchPlayerStats } from '../utils/thunk';

export const playerStatsSlice = createSlice({
    name: 'playerStats',
    initialState: {
        loading: true,
        playerStats: {}
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchPlayerStats.pending, (state) => {
            state.loading = true;
            console.log("fetchPlayersStats pending")
        })
        .addCase(fetchPlayerStats.fulfilled, (state, action) => {
            console.log("fetchPlayerStats fulfilled")

            state.playerStats = action.payload
            state.loading = false;

            console.log('player stats: ', state.playerStats)
        })
        .addCase(fetchPlayerStats.rejected, (state) => {
            state.loading = false;
            console.log("fetchPlayerStats rejected")
        })
    }
})

export default playerStatsSlice.reducer;
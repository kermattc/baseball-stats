import { configureStore } from '@reduxjs/toolkit'
import playersReducer from './reducers/players'
import playerStatsReducer from './reducers/playerStats'

export const store = configureStore({
    reducer: {
        players: playersReducer,
        playerStats: playerStatsReducer
    }
})
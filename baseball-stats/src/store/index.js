import { configureStore } from '@reduxjs/toolkit'
import playersReducer from './reducers/players'

export const store = configureStore({
    reducer: {
        players: playersReducer
    }
})
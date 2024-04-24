import { configureStore } from '@reduxjs/toolkit'

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import playersReducer from './reducers/players'
import playerStatsReducer from './reducers/playerStats'
import loginReducer from './reducers/loginStatus'

const persistConfig = {
    key: 'root',
    storage,
};
  
const persistedReducer = persistReducer(persistConfig, loginReducer)
  
export const store = configureStore({
    reducer: {
        players: playersReducer,
        playerStats: playerStatsReducer,    
        login: persistedReducer
    },
    // {
    //     players: playersReducer,
    //     playerStats: playerStatsReducer,
    //     loginStatus: loginReducer
    // }
})

export const persistor = persistStore(store)

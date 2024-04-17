import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const URL_SERV = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
// var option = {
//     url: URL_SERV,
//     headers:{
//         'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
//         'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
//     }
// }
// console.log("api key: ", import.meta.env.VITE_API_KEY)

// const getPlayersList = {
//     method: 'GET',
//     url: option.url + '/getMLBPlayerList',
//     headers: option.headers
// }


// export const fetchPlayersList = createAsyncThunk(
//     'players/fetchPlayers',
//     async() => {
//         try {
//             const response = await axios.request(getPlayersList)
//             // const response = await axios.request(options);

//             return response.data
//         } catch (error) {
//             throw error;
//         }
//     }
// )

// // get player ID from frontend and pass it into the API call
// export const fetchPlayerStats = createAsyncThunk(
//     'player/fetchPlayerStats',
//     async(selectedPlayerID, thunkAPI) => {
//         try {
//             console.log("from fetch player stats thunk - selected player ID: ", selectedPlayerID)
//             const getPlayerStats = {
//                 method: 'GET',
//                 url: option.url + '/getMLBGamesForPlayer',
//                 params: {playerID: selectedPlayerID},
//                 headers: {
//                     'X-RapidAPI-Key': '01637a011cmshbae963a49297aa1p15a0e8jsn6bd4b4d392dd',
//                     'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
//                   }
//             }
//             const response = await axios.request(getPlayerStats)
//             return response.data
//             // console.log('from thunk. response: ', response.data);
//         } catch (error) {
//             console.error(error)
//         }
//     }
// )


////////////////////////////////////////////////
//      DEBUG METHODS                       ////
////////////////////////////////////////////////

const URL_SERV = 'http://127.0.0.1:5000/'   // for debugging

const getPlayersList = URL_SERV + 'player-list'

export const fetchPlayersList = createAsyncThunk(
    'players/fetchPlayers',
    async() => {
        try {
            const response = await axios.request(getPlayersList)
            // const response = await axios.request(options);

            return response.data
        } catch (error) {
            throw error;
        }
    }
)

const getPlayerStats = URL_SERV + 'hitter-stats'
// const getPlayerStats = URL_SERV + 'pitcher-stats'
export const fetchPlayerStats = createAsyncThunk(
    'playerStats/fetchPlayerStats',
    async() => {
        try {
            const response = await axios.request(getPlayerStats)
            return response.data
        } catch (error) {
            console.error(error)
        }
    }
)
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL_SERV = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
var option = {
    url: URL_SERV,
    headers:{
        'X-RapidAPI-Key': '01637a011cmshbae963a49297aa1p15a0e8jsn6bd4b4d392dd',
        'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
    }
}

const getPlayersList = {
    method: 'GET',
    url: option.url + '/getMLBPlayerList',
    headers: option.headers
}

// console.log("getPlayersList: ", getPlayersList)

export const fetchPlayersList = createAsyncThunk(
    'home/fetchPlayers',
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

// const options = {
//     method: 'GET',
//     url: 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBPlayerList',
//     headers: {
//       'X-RapidAPI-Key': '01637a011cmshbae963a49297aa1p15a0e8jsn6bd4b4d392dd',
//       'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
//     }
//   };
  
//   try {
//       const response = await axios.request(options);
//       console.log(response.data);
//   } catch (error) {
//       console.error(error);
//   }


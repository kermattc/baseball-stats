import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Favourites = () => {
    const [favPlayers, setFavPlayers] = useState([])

    // getting players
    // write a function that makes an axios fetch to the backend to get the player's favourite players
    // axios fetch with username -> get user's favourite players from mongo db -> display them here for starters
    const getFavPlayers = () => {
        axios.get('/user/getFavourites', {
            username: 'asoidfjioajfewio'
        })
        .then(response => {
            console.log("Response: ", response)
            // console.log("Pulling up favourite players. response: ", response)

        })
        .catch(error => {
            console.log("User is probably not logged in")
            console.log("Error 400 bad request", error)
        })
    }

    useEffect(() => {
        const allCookies = document.cookie;
        console.log(allCookies)
        getFavPlayers();

    }, []);


    // CRUD operations
    // here the user can make changes to their favourite players
    // Add new ones, update and delete
    return (
        <>
            Page for favourite players. idk what to do with this rn
        </>
    )
}

export default Favourites;
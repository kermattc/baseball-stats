import Layout from '../layouts';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Favourites = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [favPlayers, setFavPlayers] = useState([])
    const loggedIn = useSelector((state) => state.login.loggedIn);

    // getting players
    // write a function that makes an axios fetch to the backend to get the player's favourite players
    // axios fetch with username -> get user's favourite players from mongo db -> display them here for starters
    const getFavPlayers = () => {
        
        const token = localStorage.getItem('access_token');

        axios.get('/user/getFavourites')
        .then(response => {
            console.log("Response: ", response)
            if (response.status === 200){
                setUsername(response.data.username)
                setAuthenticated(true)

            }


        })
        .catch(function (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    console.log("Authentication failed. Is the user logged in?")

                    setAuthenticated(false)
                }
            }
        })
    }

    useEffect(() => {
        getFavPlayers();
    }, [loggedIn]);


    // WIP - CRUD operations
    // here the user can make changes to their favourite players
    // Add new ones, update and delete
    return (
        <>
            <div className="app-container">
                <Layout>
                    { authenticated ? 
                        <h2>Welcome {username}, here are your favourite players.</h2>
                    
                    : <h2>Error 403 - Are you logged in?</h2>}
                </Layout>
            </div>
        </>
    )
}

export default Favourites;
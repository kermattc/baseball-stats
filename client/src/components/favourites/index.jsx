import Layout from '../layouts';
import { setupInterceptors } from '../../utils/interceptor.jsx'

import axios from 'axios';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLogin } from '../../store/reducers/loginStatus.js'

const Favourites = () => {

    const dispatch = useDispatch();

    // const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [favPlayers, setFavPlayers] = useState([])
    const loggedIn = useSelector((state) => state.login.loggedIn);

    const usernameOrEmail = useSelector((state) => state.login.username);

    useEffect(() => {
        setupInterceptors();
    }, [])

    useEffect(() => {
        getFavPlayers();
        // console.log("authenticated: ", authenticated)
    }, [loggedIn]); 


    // // refresh access token
    // const refreshToken = async() => {
    //     try {
    //         await axios.post("/user/refresh", {
    //             username: usernameOrEmail
    //         })
    //         .then(response => {
    //             const accessToken = response.data.access_token;
    //             localStorage.setItem('access_token', accessToken);
    //         })
    //         .catch(error => {
    //             console.log("Error - can't refresh access token ", error)
    //         })
    //     } catch (error) {
    //         console.log("Unable to refresh token: ", error)
    //     }
    // }

    // // interceptor for refreshing token
    // axiosJWT.interceptors.request.use(
    //     async (config) => {
    //         console.log("config: ", config)
    //         if (config.url ==='/user/login') {  // skip login
    //             return config;
    //         }
    //         // check for expired access token and refresh if it is expired
    //         let currentDate = new Date();
    //         const decodedToken = jwtDecode(localStorage.getItem('jwt'));
    //         if (decodedToken.exp * 1000 < currentDate.getTime()) {
    //             refreshToken();
    //         }
    //     }
    // )

    const handleLogin = (loginStatus) => {
        dispatch(updateLogin(loginStatus));
    }

    // getting players
    // write a function that makes an axios fetch to the backend to get the player's favourite players
    // axios fetch with username -> get user's favourite players from mongo db -> display them here for starters
    const getFavPlayers = () => {
        
        const token = localStorage.getItem('access_token');

        axios.get('/user/getFavourites', {
            username: usernameOrEmail,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log("Response: ", response)
            if (response.status === 200){
                setUsername(response.data.username)
                handleLogin(true)
            } 
        })
        .catch(function (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    console.log("Authentication failed. Is the user logged in?")

                    handleLogin(false)
                } else if (error.response.status === 401) {
                    handleLogin(false)
                }
            }
        })
    }


    // WIP - CRUD operations
    // here the user can make changes to their favourite players
    // Add new ones, update and delete
    return (
        <>
            <div className="app-container">
                <Layout>
                    { loggedIn ? 
                        <h2>Welcome {username}, here are your favourite players.</h2>
                    
                    : <h2>Error 403 - Are you logged in?</h2>}
                </Layout>
            </div>
        </>
    )
}

export default Favourites;
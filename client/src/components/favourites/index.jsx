import Layout from '../layouts';
import { setupInterceptors } from '../../utils/interceptor.jsx'
import '../../styles/main.css'; 

import axios from 'axios';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLogin } from '../../store/reducers/loginStatus.js'

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Typography from '@mui/joy/Typography';
import ListDivider from '@mui/joy/ListDivider';
import { Button, Icon } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

const Favourites = () => {

    const dispatch = useDispatch();

    // const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [favPlayers, setFavPlayers] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const loggedIn = useSelector((state) => state.login.loggedIn);

    const usernameOrEmail = useSelector((state) => state.login.username);

    useEffect(() => {
        setupInterceptors(usernameOrEmail);
    }, [usernameOrEmail])

    useEffect(() => {
        getFavPlayers();
        // console.log("authenticated: ", authenticated)
    }, [loggedIn]); 

    const handleLogin = (loginStatus) => {
        dispatch(updateLogin(loginStatus));
    }

    // useEffect(() => {
    //     document.body.addEventListener('click', (event) => {
    //         // console.log("Clicked on: ", event.target)
    //         // console.log("Clicked class: ", event.target.classList)

    //         // console.log("Clicked id: ", event.target.id)
    //         if (!event.target.classList.contains("trash") && !event.target.classList.contains("delete-reveal")) {

    //             console.log("Did not click on the button")
    //             setConfirmDelete(false)
    //         }
    //         // console.log("Click detected that's not on the button - confirmDelete: ", confirmDelete)
    //     })
    // }, [])

    // const handleDelete = () => {
    //     console.log("handle delete")
    //     setConfirmDelete(true);
    // };

    const handleButtonClick = async(player, mode) => {
        console.log("Function got called. Player: ", player, " mode: ", mode)
        const firstDeleteButtonId = `${player}-delete`;
        const secondDeleteButtonId = `${player}-delete-confirm`;
        const cancelDeleteButtonId = `${player}-delete-cancel`;
    
        const firstDeleteButton = document.getElementById(firstDeleteButtonId);
        const secondDeleteButton = document.getElementById(secondDeleteButtonId);
        const cancelDeleteButton = document.getElementById(cancelDeleteButtonId);
        
        if (mode === 'confirmation') {
            firstDeleteButton.style.display = 'none';
            secondDeleteButton.style.display = 'inline-block';
            cancelDeleteButton.style.display = 'inline-block';
        } else if (mode === 'cancellation') {
            firstDeleteButton.style.display = 'inline-block';
            secondDeleteButton.style.display = 'none';
            cancelDeleteButton.style.display = 'none';
        }
    }
    
    const removeFavPlayer = (player) => {
        console.log("player to remove: ", player)
        const token = localStorage.getItem('access_token');

        axios.post('/user/removeFavourite', {
            username: usernameOrEmail,
            player: player
        }, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // const res = response.data
            console.log("Successfully removed player: ", response)
            getFavPlayers();
            handleButtonClick(player, 'cancellation')
        })
        .catch(error => {
            console.log("Error: ", error);
        })
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

                console.log("favourite players: ", response.data.favPlayers)
                const favPlayersResponse = response.data.favPlayers

                const players = favPlayersResponse.map(player => {
                    return (
                        <>
                            <List
                                aria-labelledby="ellipsis-list-demo"
                                sx={{ '--ListItemDecorator-size': '56px' }}
                                >
                                <ListItem id={`favplayer-${player}`}>
                                    <ListItemDecorator>
                                        <Avatar src="/static/images/avatar/1.jpg" />
                                    </ListItemDecorator>
                                    <ListItemContent>
                                        <Typography level="title-lg">{player}</Typography>
                                        <Typography level="body-lg">
                                            Some information about this player. TBD
                                        </Typography>
                                    </ListItemContent>
                                    {/* <Button icon>
                                        <Icon name='arrows alternate vertical'/>
                                    </Button> */}
                                    <div className="delete-button-container">
                                        <Button id={`${player}-delete`} onClick={() => handleButtonClick(player, 'confirmation')}>
                                            <FontAwesomeIcon icon={faTrash} />                  
                                        </Button>
                                        <Button id={`${player}-delete-confirm`} onClick={() => removeFavPlayer(player)} style={{ display: 'none' }} color='red'>
                                            Delete fo' realsies?
                                        </Button>
                                        <Button id={`${player}-delete-cancel`} onClick={() => handleButtonClick(player, 'cancellation')} style={{ display: 'none' }}>
                                            <FontAwesomeIcon icon={faXmark}/>
                                        </Button>
                                    </div>
                                </ListItem>
                                
                            </List>
                            <ListDivider inset={'gutter'}/>
                        </>
                    ) 
                })
                setFavPlayers(players)
                console.log("favourite players from list: ", players)
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
                        favPlayers.length > 0 ?
                        <>
                            <Box id="fav-players-box" sx={{ width: screen.width * 0.8 }}>
                                <Typography
                                    id="favPlayers-title"
                                    level="body-xl"
                                    sx={{ letterSpacing: '0.15rem' }}
                                >
                                    Welcome {username}, here are your favourite players.
                                </Typography>
                                {favPlayers}
                            </Box>
                        </> 
                        :
                        <h2>You have no favourites. Add some bitch!</h2>
                    : <h2>Error 403 - Are you logged in?</h2>}
                </Layout>
            </div>
        </>
    )
}

export default Favourites;
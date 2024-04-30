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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Favourites = () => {

    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [favPlayers, setFavPlayers] = useState([]);
    const loggedIn = useSelector((state) => state.login.loggedIn);

    const usernameOrEmail = useSelector((state) => state.login.username);

    useEffect(() => {
        setupInterceptors(usernameOrEmail);
    }, [usernameOrEmail])

    useEffect(() => {
        getFavPlayers();
    }, [loggedIn]); 

    const handleLogin = (loginStatus) => {
        dispatch(updateLogin(loginStatus));
    }

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
            
            toast.success(`Removed ${player} from favourites!`, {
                position: "top-center",
                hideProgressBar: true,
                theme: 'dark'
            })

            handleButtonClick(player, 'cancellation')

        })
        .catch(error => {
            console.log("Error: ", error);
            toast.error(`Error while removing. Sorry!`, {
                position: "top-center",
                hideProgressBar: true,
                theme: 'dark'
            })
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

                                    <div className="delete-button-container">
                                        <Button id={`${player}-delete`} onClick={() => handleButtonClick(player, 'confirmation')}>
                                            <FontAwesomeIcon icon={faTrash} />                  
                                        </Button>
                                        <Button id={`${player}-delete-confirm`} onClick={() => removeFavPlayer(player)} style={{ display: 'none' }} color='red'>
                                            Delete?
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

    // CRUD operations
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
                                <h1 className="ui header">Welcome {username}, here are your favourite players.</h1>
                                {favPlayers}
                            </Box>
                        </> 
                        :
                        <>
                            <Box id="fav-players-box" sx={{ width: screen.width * 0.8 }}>
                                <h1 className="ui header">Welcome to the favourites page! You can view your favourite players here once you add them.</h1>
                            </Box>
                        </>
                    :         
                    <>                    
                        <Box id="fav-players-box" sx={{ width: screen.width * 0.8 }}>
                            <h1 className="ui header">Welcome to the favourites page! You need to login in order to save your favourite players.</h1>
                        </Box>
                    </>
                }
                </Layout>    
            </div>
            <ToastContainer/>
        </>
    )
}

export default Favourites;
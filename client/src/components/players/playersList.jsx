import { Button } from 'react-bootstrap';
import { fetchPlayersList, fetchPlayerStats } from '../../store/utils/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { components } from 'react-select';
import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlayersList = ({ onPlayerSelect }) => {
    const loggedIn = useSelector((state) => state.login.loggedIn);
    const usernameOrEmail = useSelector((state) => state.login.username);

    const players = useSelector((state) => state.players)

    const dispatch = useDispatch();

    const [playersList, setPlayersList] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    const sortPlayers = (data) => {
        const newData = data.slice().sort((a,b) => a.longName.localeCompare(b.longName))
        return newData;
    }

    // get list of players from redux store and sort them alphabetically
    useEffect(() => {
        dispatch(fetchPlayersList())
        .then((response) => {
            if (response.payload) {
                const sortedData = sortPlayers(response.payload.body);

                setPlayersList(sortedData.map(player => ({
                    value: player,
                    label: player.longName
                })))
            }
        })
    }, []);

    // update variables when a player is clicked on
    const handleSelectedPlayer = (option) => {
        setSelectedOption(option);
        onPlayerSelect(option.value.playerID)
    };

    // add new player to list of favourites
    const handleFavPlayer = (stuff) => {
        const favPlayer = stuff.props.children
        const token = localStorage.getItem('access_token');

        axios.post('/user/addFavourite', {
            username: usernameOrEmail,
            favPlayer: favPlayer
        }, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            const res = response.data
            console.log("response: ", res)
            toast.success(`Added ${favPlayer} to favourites!`, {
                position: "bottom-center",
                hideProgressBar: true,
            })
        })
        .catch(error => {
            console.log("Error: ", error, response);
        })
    }

    // custom component, include a button to each list item for the react-select list
    const SelectMenuButton = (props) => {
        const { children, ...rest } = props;

        const childrenWithButton = React.Children.map(children, (child) => {    // React.Children.map allows mapping over children (haha)
        const playerName = child
            return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: '1' }}>{playerName}</div>
                    <Button style={{ marginLeft: '8px' }} disabled={!loggedIn} onClick={() => handleFavPlayer(playerName)}>
                        <FontAwesomeIcon icon={faHeart} />                      
                    </Button>
                </div>
            );
        }
    )
        return <components.MenuList {...rest}>{childrenWithButton}</components.MenuList>;
    }

    return (
        <>
            {!players.loading ? ( 
                <>
                <h5>Select a player</h5>
                    <Select
                        value={selectedOption}
                        onChange={handleSelectedPlayer}
                        options={playersList}
                        components={{ MenuList: SelectMenuButton }}
                    />
                </>
            ) : null}
            <ToastContainer/>
        </>
    );
}

export default PlayersList;

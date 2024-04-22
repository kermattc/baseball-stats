import PlayersList from '../players/playersList.jsx';
import PlayerGames from '../players/playerGames.jsx';
import PlayerCard from '../players/playerCard.jsx';

import '../../styles/main.css';
import Sidebar from '../sidebar/sidebar.jsx';
import { useState, useEffect } from 'react';

import axios from 'axios';

const Home = () => {

    const [selectedPlayerID, setSelectedPlayerID] = useState(null);
    const [playerStats, setPlayerStats] = useState([]);
    const [selectedGames, setSelectedGames] = useState([]);
    const [removeGame, setRemoveGame] = useState('');

    const handlePlayerSelect = (playerID) => {
        setSelectedPlayerID(playerID)
    }

    const populatePlayerStats = (fetchedPlayerStats) => {
        setPlayerStats(fetchedPlayerStats)
    }

    const handleSelectedGames = (game) => {
        console.log('selectedGames: ', selectedGames)

        setSelectedGames( prevSelectedGames => [
            ...prevSelectedGames,
            game
        ])
    }

    useEffect(() => {
        // const checkDuplicates = (games) => {
            const temp = selectedGames
            var dupeGame = false
            if (temp.length > 1) {
                const latestGame = temp[temp.length-1]
                for (var i = 0; i < temp.length-1; i++) {
                    if (temp[i] === latestGame) {
                        temp.splice(i, 1)
                        temp.splice(-1)
                        setSelectedGames(temp)
                        dupeGame = true
                    }
                }
                dupeGame ? setRemoveGame(latestGame) : setRemoveGame("")
            }
        // }
    }, [selectedGames])


    const onLogin = () => {
        axios.get('/api/login', {
            message: 'logging in user'
        })
        .then( response => {
            console.log(response.data);
        })
        .catch(err => console.log('axios post error: ', err))
    }

    return (
        <>
            <div className="app-container">
                <div className="sidebar-container">
                    <Sidebar/>
                </div>
                <div className="main-content">
                    {/* <div className="player-games-container"> */}
                    <PlayersList onPlayerSelect={handlePlayerSelect} />
                    {/* </div> */}
                    <PlayerGames
                        playerID={selectedPlayerID}
                        getPlayerStats={populatePlayerStats}
                        onGameSelect={handleSelectedGames}
                    />
                    <PlayerCard
                        playerGames={selectedGames}
                        playerStats={playerStats}
                        gameToRemove={removeGame}
                    />
                    
                    {/* <button onClick={() => onLogin()}>Login</button> */}
                </div>
            </div>
        </>
    )
}

export default Home;
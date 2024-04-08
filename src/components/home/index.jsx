import PlayersList from '../players/playersList.jsx';
import PlayerGames from '../players/playerGames.jsx';
import PlayerCard from '../players/playerCard.jsx';
import { useEffect, useState } from 'react';

const Home = () => {

    const [selectedPlayerID, setSelectedPlayerID] = useState(null);
    const [playerStats, setPlayerStats] = useState([]);
    const [selectedGames, setSelectedGames] = useState([]);

    const handlePlayerSelect = (playerID) => {
        setSelectedPlayerID(playerID)
    }

    const populatePlayerStats = (fetchedPlayerStats) => {
        setPlayerStats(fetchedPlayerStats)
    }
    
    const handleSelectedGames = (game) => {
        setSelectedGames( prevSelectedGames => [
            ...prevSelectedGames,
            game
        ])
    }

    return (
        <>
            {/* {console.log("selected games: ", selectedGames)} */}
            <PlayersList onPlayerSelect={handlePlayerSelect}/>
            <PlayerGames playerID={selectedPlayerID} getPlayerStats={populatePlayerStats} onGameSelect={handleSelectedGames}/>
            <PlayerCard playerGames={selectedGames} playerStats={playerStats}/>
        </>
    )
}

export default Home;
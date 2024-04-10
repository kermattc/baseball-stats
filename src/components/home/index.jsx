import PlayersList from '../players/playersList.jsx';
import PlayerGames from '../players/playerGames.jsx';
import PlayerCard from '../players/playerCard.jsx';
import { useState, useEffect } from 'react';

const Home = () => {

    const [selectedPlayerID, setSelectedPlayerID] = useState(null);
    const [newGameAdded, setNewGameAdded] = useState(false)
    const [playerStats, setPlayerStats] = useState([]);
    const [selectedGames, setSelectedGames] = useState([]);

    const [hasDuplicateGame, setHasDuplicateGame] = useState(false);

    // useEffect(() => {
        // checkDuplicateGame();
    // }, [selectedGames]);

    const handlePlayerSelect = (playerID) => {
        setSelectedPlayerID(playerID)
    }

    const populatePlayerStats = (fetchedPlayerStats) => {
        setPlayerStats(fetchedPlayerStats)
    }

    // const checkDuplicateGame = () => {
    //     if (selectedGames.length > 1) {
    //         const latestGame = selectedGames[selectedGames.length-1]

    //         for (let i = 0; i < selectedGames.length -1; i++) {
    //             if (selectedGames[i] === latestGame) {
    //                 console.log("Filter results: ", selectedGames.filter((game, index) => index !== selectedGames.length - 1 && index !== i))

    //                 setSelectedGames((prevSelectedGames) => 
    //                     prevSelectedGames.filter((game, index) => index !== selectedGames.length - 1 && index !== i
    //                 ))
    //                 setHasDuplicateGame(true);
    //                 return
    //             }
    //         }
    //     }
    //     setHasDuplicateGame(false);
    // }

    const handleSelectedGames = (game) => {
        console.log("Selected Games: ", selectedGames, " incoming game: ", game)
            setSelectedGames( prevSelectedGames => [
                ...prevSelectedGames,
                game
            ]
        )
    }

    return (
        <>
            {console.log("selected games: ", selectedGames)}
            <PlayersList onPlayerSelect={handlePlayerSelect}/>
            <PlayerGames playerID={selectedPlayerID} getPlayerStats={populatePlayerStats} onGameSelect={handleSelectedGames}/>
            <PlayerCard playerGames={selectedGames} playerStats={playerStats}/>
            
            {/* { selectedGames.map( (game) => ( */}
            {/* <PlayerCard key={game.id} playerGames={game} playerStats={playerStats} /> */}
            {/* )) */}
            {/* } */}
        </>
    )
}

export default Home;
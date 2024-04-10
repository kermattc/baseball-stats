// import PlayersList from '../players/playersList.jsx';
// import PlayerGames from '../players/playerGames.jsx';
// import PlayerCard from '../players/playerCard.jsx';
// import { useState, useEffect } from 'react';

// const Home = () => {

//     const [selectedPlayerID, setSelectedPlayerID] = useState(null);
//     const [playerStats, setPlayerStats] = useState([]);
//     const [selectedGames, setSelectedGames] = useState([]);
//     const [removeGame, setRemoveGame] = useState('');

//     const handlePlayerSelect = (playerID) => {
//         setSelectedPlayerID(playerID)
//     }

//     const populatePlayerStats = (fetchedPlayerStats) => {
//         setPlayerStats(fetchedPlayerStats)
//     }

//     const handleSelectedGames = (game) => {
//         console.log('selectedGames: ', selectedGames)

//         setSelectedGames( prevSelectedGames => [
//             ...prevSelectedGames,
//             game
//         ])
//     }

//     const checkDuplicates = (games) => {
//         const temp = games
//         var dupeGame = false
//         if (temp.length > 1) {
//             const latestGame = temp[temp.length-1]
//             for (var i = 0; i < temp.length-1; i++) {
//                 if (temp[i] === latestGame) {
//                     temp.splice(i, 1)
//                     temp.splice(-1)
//                     setSelectedGames(temp)
//                     dupeGame = true
//                 }
//             }
//             dupeGame ? setRemoveGame(latestGame) : setRemoveGame("")
//         }
//     }

//     return (
//         <>
//             {checkDuplicates(selectedGames)}
//             {console.log("Game to remove: ", removeGame)}
//             {/* {console.log("After checking duplicate games: ", selectedGames)} */}
//             <PlayersList onPlayerSelect={handlePlayerSelect}/>
//             <PlayerGames playerID={selectedPlayerID} getPlayerStats={populatePlayerStats} onGameSelect={handleSelectedGames}/>
//             <PlayerCard playerGames={selectedGames} playerStats={playerStats} gameToRemove={removeGame}/>
//         </>
//     )
// }

// export default Home;

import PlayersList from '../players/playersList.jsx';
import PlayerGames from '../players/playerGames.jsx';
import PlayerCard from '../players/playerCard.jsx';
import { useState, useEffect } from 'react';

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
        setSelectedGames(prevSelectedGames => [
            ...prevSelectedGames,
            game
        ])
    }

    useEffect(() => {
        const checkDuplicates = (games) => {
            const temp = games
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
        }

        checkDuplicates(selectedGames);
    }, [selectedGames]);

    return (
        <>
            <PlayersList onPlayerSelect={handlePlayerSelect}/>
            <PlayerGames playerID={selectedPlayerID} getPlayerStats={populatePlayerStats} onGameSelect={handleSelectedGames}/>
            <PlayerCard playerGames={selectedGames} playerStats={playerStats} gameToRemove={removeGame}/>
        </>
    )
}

export default Home;

/* 
    Get the selected games and display the game details from the player stats object
*/

import { useEffect, useState } from 'react';
import PlayerStatsCard from './playerStatsCard'

const PlayerCard = ( { playerGames, playerStats, gameToRemove } ) => {

    const [gameStats, setGameStats] = useState([])

    // useEffect(() => {
    //     if (playerGames.length > 0) {
    //         setGameStats( prevGameStats => [
    //             ...prevGameStats,
    //             playerStats[playerGames[playerGames.length-1]]
    //         ])
    //     }
    // }, [playerGames])

    // thanks chatgpt
    useEffect(() => {
        if (playerGames.length > 0) {
            const latestGameStat = playerStats[playerGames[playerGames.length - 1]];
            
            setGameStats(prevGameStats => {
                // Check if the latest game is already present in gameStats
                const gameExists = prevGameStats.some(gameStat => gameStat.gameID === latestGameStat.gameID);
    
                if (gameExists) {
                    // If the latest game is already present, filter it out
                    return prevGameStats.filter(gameStat => gameStat.gameID !== latestGameStat.gameID);
                } else {
                    // If the latest game is not present, add it
                    return [...prevGameStats, latestGameStat];
                }
            });
        }
    }, [playerGames, playerStats]);
    

    useEffect(() => {
        console.log("Need to remove this game: ", gameToRemove)
        // using the gameToRemove (ie: 20240320_LAD@SD), find the value in the gameStats object and remove the game(s) that contains that value

        var newGameStats = gameStats.filter((item) => {
            return item.gameID !== gameToRemove
        })

        console.log("new game stats: ", newGameStats)

        setGameStats(newGameStats)
        // setGameStats(prevGameStats => prevGameStats.filter(item => item.gameID !== gameToRemove));


    }, [gameToRemove])


    return (
        <>
            {playerGames.length != 0 && playerStats.length != 0 ? (
                <>
                    <h2/>
                    {console.log("Rendering game stats: ", gameStats)}
                    <div style={{ display: 'flex', flexWrap: 'wrap'}}>
                        {gameStats.map((playerGameStats, gameNumber) => (
                            <PlayerStatsCard key={"game"+gameNumber} playerGameStats={playerGameStats}/>
                        ))}
                        
                    </div>

                </>
            ): null }
        </>
    )
}

export default PlayerCard;

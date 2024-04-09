/* 
    Get the selected games and display the game details from the player stats object
*/

import { useEffect, useState } from 'react';
import PlayerStatsCard from './playerStatsCard'

const PlayerCard = ( { playerGames, playerStats } ) => {

    const [gameStats, setGameStats] = useState([])

    useEffect(() => {
        console.log("Player games: ", playerGames)
        if (playerGames.length > 0) {
            setGameStats( prevGameStats => [
                ...prevGameStats,
                playerStats[playerGames[playerGames.length - 1]]
            ])
        }
    }, [playerGames])
    

    return (
        <>

            {console.log('Selected player game stats: ', gameStats)} 
            {playerGames.length != 0 && playerStats.length != 0 ? (
                <>
                    <div>
                        Player card for game stats begins here
                    </div>
                    <h2/>
                    {gameStats.map((playerGameStats, gameNumber) => (
                        // console.log("Key: ", key, " value: ", value)
                        // console.log("id: ", gameNumber)
                        <PlayerStatsCard key={"game"+gameNumber} playerGameStats={playerGameStats}/>
                    ))}
                </>
            ): null }
        </>
    )
}

export default PlayerCard;

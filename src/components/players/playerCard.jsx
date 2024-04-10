/* 
    Get the selected games and display the game details from the player stats object
*/

import { useEffect, useState } from 'react';
import PlayerStatsCard from './playerStatsCard'

const PlayerCard = ( { playerGames, playerStats } ) => {

    const [gameStats, setGameStats] = useState([])

    useEffect(() => {
        if (playerGames.length > 0) {
            const latestGame = playerGames[playerGames.length-1]
            console.log("Latest game: ", latestGame)
            for (var i = 0 ; i < playerGames.length-1; i++) {
                if (playerGames[i] === latestGame) {
                    console.log("Duplicate found. i: ", i)
                    var temp = playerGames.splice(i, 1)
                    temp = playerGames.splice(playerGames.length-1, 1)

                    console.log("After removing duplicate: ", temp)
                }
            }


            setGameStats( prevGameStats => [
                ...prevGameStats,
                playerStats[playerGames[playerGames.length - 1]]
            ])
        }
    }, [playerGames])


    return (
        <>
            {/* {console.log('Selected player game stats: ', gameStats)}  */}
            {console.log("Player games: ", playerGames)}
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

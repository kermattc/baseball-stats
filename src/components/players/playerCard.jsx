/* 
    Get the selected games and display the game details from the player stats object
*/

import { useEffect, useState } from 'react';
import PlayerStatsCard from './playerStatsCard'

const PlayerCard = ( { playerGames, playerStats, gameToRemove } ) => {

    const [gameStats, setGameStats] = useState([])

    useEffect(() => {
        if (playerGames.length > 0) {
            setGameStats( prevGameStats => [
                ...prevGameStats,
                playerStats[playerGames[playerGames.length-1]]
            ])
        }
    }, [playerGames])


    useEffect(() => {
        console.log("Need to remove this game: ", gameToRemove)
        // using the gameToRemove (ie: 20240320_LAD@SD), find the value in the gameStats object and remove the game(s) that contains that value
        // setGameStats()
    }, [gameToRemove])


    return (
        <>
            {/* {console.log("From playerCard - playerGames: ", playerGames)} */}
            {console.log("From playerCard - gameStats: ", gameStats)}
            {/* {console.log("From playerCard - Any games to remove? ", gameToRemove)} */}

            {/* {gameToRemove? removeDuplicateGames(gameToRemove) : null} */}
            {/* {console.log('Selected player game stats: ', gameStats)} 
            {console.log("From playerCard - playerGames: ", playerGames)}
            {console.log("From playerCard - playerStats: ", playerStats)}

            {console.log("stats using player games as key: ", playerStats[playerGames[playerGames.length-1]])} */}

            {playerGames.length != 0 && playerStats.length != 0 ? (
                <>
                    <div>
                        Player card for game stats begins here
                    </div>
                    <h2/>
                    {console.log("Game stats: ", gameStats)}
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

/* 
    Get the selected games and display the game details from the player stats object
*/

import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

const PlayerCard = ( { playerGames, playerStats } ) => {

    const [gameStats, setGameStats] = useState([])

    useEffect(() => {
        
        // setGameStats([
        //     playerStats.
        // ])
        setGameStats( prevGameStats => [
            ...prevGameStats,
            playerStats[playerGames]
        ])
        // console.log("Current game stats: ", playerStats[playerGames])


    }, [playerGames])

    return (
        <>
            {/* {console.log("Received player stats: ", playerStats)}
            {console.log("From playerCard.jsx - player games: ", playerGames)} */}

            {console.log('Selected player game stats: ', gameStats)}
            {playerGames.length != 0 && playerStats.length != 0 ? (
                <>
                    Player card for game stats begins here
                    <h2/>
                    Games: { playerGames }
                </>
            ): null }

        </>
    )
}

export default PlayerCard;

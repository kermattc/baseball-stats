/* 
    Get the selected games and display the game details from the player stats object
*/

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const PlayerCard = ( { playerGames, playerStats } ) => {


    useEffect(() => {
        console.log("New game added")
        console.log(playerGames)
        // if (playerGames && playerStats) {
        //     console.log("A player and a game has been selected.")
        //     console.log("Player games: ", playerGames)
        //     console.log("Player stats: ", playerStats)
        // }
    }, [playerGames])

    return (
        <>
            {console.log("From playerCard.jsx - player games: ", playerGames)}
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

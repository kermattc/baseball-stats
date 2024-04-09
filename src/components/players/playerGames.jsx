/* 
    In playersList.jsx, user selects player from dropdown menu
        Get player ID, pass as prop from playersList component to this component
        Using the playerID, make an API call to get all the player games this season and stats per game
        Populate a list of games played
*/
import { fetchPlayerStats } from '../../store/utils/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

const PlayerGames = ( {playerID, getPlayerStats, onGameSelect} ) => {
    const dispatch = useDispatch();
    const playerStats = useSelector(state => state.playerStats)

    const [playerGames, setPlayerGames] = useState([]);
    // const [allPlayerStats, setAllPlayerStats] = useState([]);

    const handleAllPlayerStats = (playerStatsObj) => {
        getPlayerStats(playerStatsObj)
    }

    const handleSelectedGame = (item) => {
        console.log("Selected game: ", item)
        onGameSelect(item)
    }

    useEffect(() => {
        if (playerID) {
            dispatch(fetchPlayerStats(playerID))
            // dispatch(fetchPlayerStats())    // temporary fetching shohei ohtani stats. Later it'll be used for any player id 
            .then((response) => {
                if (response.payload) {
                    console.log("response: ", response)
                    const playerStats = response.payload.body;

                    console.log("Need to pass this to playerCard.jsx: ", playerStats)
                    handleAllPlayerStats(playerStats)

                    const temp = Object.keys(playerStats)
                    console.log("Player games: ", playerGames)
                    const gameDetails = temp.map(game => {
                        const year = game.substring(0,4); 
                        const month = game.substring(4,6);
                        const date = game.substring(6,8);
                        const match = game.split("_")[1];
                        
                        return ({gameID: game, gameLabel: match + ' on '+year+'/'+month+'/'+date})
                    })

                    console.log('debug: ', gameDetails)
                    setPlayerGames(gameDetails.map((game) => 
                        <li key={game.gameID}>{game.gameLabel}
                            <Button onClick={() => handleSelectedGame(game.gameID)}></Button>
                        </li>
                    ))
                }
            })
        }
        console.log("made it here")
    }, [playerID])


    return (
        <>
            {!playerStats.loading ? (  
                <>
                    <h3>Select a game to view this player's stats</h3>
                    <ul>{playerGames}</ul> 
                </>
            ) : null}
        </>
    )
}

export default PlayerGames;

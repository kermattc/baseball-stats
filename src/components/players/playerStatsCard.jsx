/* 
    Get the selected games and display the game details from the player stats object
*/

import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

const PlayerStatsCard = ( { playerGameStats } ) => {
    // console.log("asdf: ", playerGameStats)

    const gameID = playerGameStats.gameID
    const year = gameID.substring(0,4); 
    const month = gameID.substring(4,6);
    const date = gameID.substring(6,8);
    const match = gameID.split("_")[1];
    const gameName = match + ' on '+year+'/'+month+'/'+date 

    const startingPosition = playerGameStats.startingPosition
    

    const renderStats = (position) => {
        switch(position) {
            case 'P':
                const pitchingStats = playerGameStats.Pitching

                const [isPitchingVisible, setIsPitchingVisible] = useState(false);

                const toggleAdditionalPitchingStats = () => {
                    setIsPitchingVisible(!isPitchingVisible)
                }

                return (
                    <>
                        {playerGameStats.started ? <div>Starting Pitcher</div> : <div>Relief Pitcher</div>}
                        <div>ERA: {pitchingStats['ERA']}</div>
                        <div>ER: {pitchingStats['ER']}</div>
                        <div>R: {pitchingStats['R']}</div>
                        <div>SO: {pitchingStats['SO']}</div>
                        <div>BB: {pitchingStats['BB']}</div>
                        <div>H: {pitchingStats['H']}</div>
                        <div>HR: {pitchingStats['HR']}</div>
                        <div>IningsPitched: {pitchingStats['InningsPitched']}</div>
                        <div>Pitches: {pitchingStats['Pitches']}</div>

                        <Button onClick={toggleAdditionalPitchingStats}>More stats</Button>
                            {isPitchingVisible && 
                                <>
                                    <div>Strikes: {pitchingStats['Strikes']}</div>
                                    <div>Batters Faced: {pitchingStats['Batters Faced']}</div>
                                    <div>Flyouts: {pitchingStats['Flyouts']}</div>
                                    <div>Groundouts: {pitchingStats['Groundouts']}</div>
                                    <div>Inherited Runners: {pitchingStats['Inherited Runners']}</div>
                                    <div>Inherited Runners Scored: {pitchingStats['Inherited Runners Scored']}</div>
                                    <div>Wild Pitch: {pitchingStats['Wild Pitch']}</div>
                                    <div>Balk: {pitchingStats['Balk']}</div>
                                    <div>Pitching Order: {pitchingStats['pitchingOrder']}</div>

                                </>
                            }
                    </>
                )
            case 'LF':
            case 'CF':
            case 'RF':
            case '1B':
            case '2B':
            case 'SS':
            case '3B':
            case 'DH':
            case 'C':
                const hittingStats = playerGameStats.Hitting
                const baserunningStats = playerGameStats.BaseRunning

                const [isHittingVisible, setIsHittingVisible] = useState(false);

                const toggleAdditionalHittingStats = () => {
                    setIsHittingVisible(!isHittingVisible)
                }

                return (
                    <>
                        {playerGameStats.started ? 
                            <>
                                <div>Starting Position: {startingPosition} </div>
                                <div>AVG: {hittingStats['AVG']}</div>
                                <div>Hits: {hittingStats['H']}</div>
                                <div>2B: {hittingStats['2B']}</div>
                                <div>3B: {hittingStats['3B']}</div>
                                <div>AB: {hittingStats['AB']}</div>
                                <div>HR: {hittingStats['HR']}</div>
                                <div>R: {hittingStats['R']}</div>
                                <div>RBI: {hittingStats['RBI']}</div>
                                <div>BB: {hittingStats['BB']}</div>
                                <div>SO: {hittingStats['SO']}</div>

                                <Button onClick={toggleAdditionalHittingStats}>More stats</Button>
                                {isHittingVisible && 
                                    <>
                                        <div>SAC: {hittingStats['SAC']}</div>
                                        <div>GIDP: {hittingStats['GIDP']}</div>
                                        <div>HBP: {hittingStats['HBP']}</div>
                                        <div>IBB: {hittingStats['IBB']}</div>
                                        <div>SAC: {hittingStats['SAC']}</div>
                                        <div>SF: {hittingStats['SF']}</div>
                                        <div>TB: {hittingStats['TB']}</div>
                                        <div>Batting Order: {hittingStats.battingOrder}</div>
                                        <div>Substitution Order: {hittingStats.substitutionOrder}</div>

                                    </>
                                }
                            </>
                        : <div>No starting position</div>}

                        <div>Baserunning</div>
                        <div>CS: {baserunningStats['CS']}</div>
                        <div>PO: {baserunningStats['PO']}</div>
                        <div>SB: {baserunningStats['SB']}</div>

                    </>
                )
            default:
                return null;
        }
    }

    return (
        <>
            {/* {console.log('from player card: ', playerGameStats)} */}
            <h2> Game: {gameName} </h2>
            <div> Image of player here </div>

            {renderStats(playerGameStats.allPositionsPlayed)}

            <hr/>
        </>
    )
}

export default PlayerStatsCard;
    
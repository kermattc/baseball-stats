import { Button } from 'react-bootstrap';
import { fetchPlayersList, fetchPlayerStats } from '../../store/utils/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Select from 'react-select';

{/* <Select filterOption={createFilter({ignoreAccents: false})}></Select>  */}

const PlayersList = ({ onPlayerSelect }) => {
    const players = useSelector((state) => state.players)

    const dispatch = useDispatch();

    const [playersList, setPlayersList] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    const sortPlayers = (data) => {
        const newData = data.slice().sort((a,b) => a.longName.localeCompare(b.longName))
        return newData;
    }

    const handleSelectedPlayer = (option) => {
        setSelectedOption(option);
        // console.log(`Option selected:`, option);
        // console.log("Player id: ", option.value.playerID)
        onPlayerSelect(option.value.playerID)
    };


    useEffect(() => {
        dispatch(fetchPlayersList())
        .then((response) => {
            if (response.payload) {
                const sortedData = sortPlayers(response.payload.body);

                setPlayersList(sortedData.map(player => ({
                    value: player,
                    label: player.longName
                })))
            }
        })
    }, []);


    return (
        <>
            {!players.loading ? ( 
                <>
                <h5>Select a player</h5>
                    <Select
                        value={selectedOption}
                        onChange={handleSelectedPlayer}
                        options={playersList}
                    />
                </>
            ) : null}
        </>
    );
}

export default PlayersList;

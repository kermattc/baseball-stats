import { Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { fetchPlayersList  } from '../../store/utils/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const HomePlayers = () => {
    const players = useSelector((state) => state.players)
    const dispatch = useDispatch();

    const [playersList, setPlayersList] = useState([]);

    useEffect(() => {
        dispatch(fetchPlayersList())
        .then((response) => {
            if (response.payload) {
                console.log("response.paylod: ", response.payload)
                const sortedData = sortPlayers(response.payload.body);
                setPlayersList(sortedData);
            }
        })
    }, []);

    // useEffect(() => {
    //     if (players.playersList.body) {
    //         sortPlayers();
    //     }
    // }, [players])


    const sortPlayers = (data) => {
        // console.log('players: ', players.playersList.body)
        // var data = players.playersList.body;
        const newData = data.slice().sort((a,b) => a.longName.localeCompare(b.longName))

        return newData;

    }

    return (
        <>
            Home players
            <Dropdown>
                <Dropdown.Toggle variant="Primary" id="dropdown-basic">
                    Select Player
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {players.loading ? (
                        <Dropdown.Item disabled>Loading...</Dropdown.Item>
                    ) : 
                    (
                        playersList.map(item => (
                            <Dropdown.Item key={item.playerID}>{item.longName}</Dropdown.Item>
                        ))
                        // players.playersList.body.map(item => (
                        //     <Dropdown.Item key={item.playerID}>{item.longName}</Dropdown.Item>
                        // ))
                    )}
                </Dropdown.Menu>
            </Dropdown>

            <Button onClick={()=>sortPlayers()}>Debug</Button>
        </>
    );
}

export default HomePlayers;


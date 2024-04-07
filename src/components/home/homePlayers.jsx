import { Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { fetchPlayersList, fetchPlayerStats } from '../../store/utils/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Select from 'react-select';

<ReactSelect filterOption={createFilter({ignoreAccents: false})}></ReactSelect>

const HomePlayers = () => {
    const players = useSelector((state) => state.players)
    // const playerStats = useSelector((state) => state.playerStats)

    const dispatch = useDispatch();

    const [playersList, setPlayersList] = useState([]);
    const [playerGames, setPlayerGames] = useState([]);
    // const [playerStats, setPlayerStats] = useState([]);

    useEffect(() => {
        dispatch(fetchPlayersList())
        .then((response) => {
            if (response.payload) {
                // console.log("response.paylod: ", response.payload)
                const sortedData = sortPlayers(response.payload.body);
                setPlayersList(sortedData);
            }
        })

        dispatch(fetchPlayerStats())    // temporary fetching shohei ohtani stats. Later it'll be used for any player id 
        .then((response) => {
            if (response.payload) {
                // console.log("response: ", response)
                const playerStats = response.payload.body;
                const temp = Object.keys(playerStats)
                console.log("Player games: ", playerGames)
                const gameDetails = temp.map(game => { 
                    const year = game.substring(0,4); 
                    const month = game.substring(4,6);
                    const date = game.substring(6,8);
                    const match = game.split("_")[1];
                    
                    return (year+'/'+month+'/'+date+'_'+match)
                })
                // console.log("game details: ", gameDetails)
                setPlayerGames(gameDetails.map((game) => 
                <li key={game}>{game}</li>    
                ))
            }
        })
    }, []);

    const sortPlayers = (data) => {
        const newData = data.slice().sort((a,b) => a.longName.localeCompare(b.longName))
        return newData;
    }

    const [selectedOption, setSelectedOption] = useState(null);

    const handleChange = (option) => {
        setSelectedOption(option);
        console.log(`Option selected:`, option);
      };

      const optionsArray = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ];

    return (
        <>
            <Select
                value={selectedOption}
                onChange={handleChange}
                options={playersList}
            />
            Home page
            {/* <Dropdown>
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
            </Dropdown> */}

            <ul>{playerGames}</ul>
            {/* <Button onClick={()=>sortPlayers()}>Debug</Button> */}
        </>
    );
}

export default HomePlayers;


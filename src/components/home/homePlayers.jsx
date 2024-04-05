import Dropdown from 'react-bootstrap/Dropdown';
import { fetchPlayersList } from '../../store/utils/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const HomePlayers = () => {
    const players = useSelector((state) => state.players)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPlayersList())
    }, [])

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
                    ) : (
                        players.playersList.body.map(item => (
                            <Dropdown.Item key={item.playerID}>{item.longName}</Dropdown.Item>
                        ))
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );

    

    // return (
    //     <>
    //         {players.loading && players.playersList.body ? (
    //             players.playersList.body.map(item => (
    //                 <div key={item.playerID}>{item.longName}</div>
    //             ))
    //         ) : null}
    //         Home players
    //         <Dropdown>
    //             <Dropdown.Toggle variant="Primary" id="dropdown-basic">
    //                 Dropdown Button
    //             </Dropdown.Toggle>
    
    //             <Dropdown.Menu>
    //                 <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
    //                 <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
    //                 <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
    //             </Dropdown.Menu>
    //         </Dropdown>

    //         {console.log(players.playersList.body)}
    

    //     </>
    // )

    // return(
    //     <>
    //         Home players
    //         <Dropdown>
    //             <Dropdown.Toggle variant="Primary" id="dropdown-basic">
    //                 Dropdown Button
    //             </Dropdown.Toggle>



    //             <Dropdown.Menu>

    //                 <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
    //                 <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
    //                 <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
    //             </Dropdown.Menu>
    //         </Dropdown>
    //         {players.loading && players.playersList.body ? players.playersList.body.map(item => (
    //                     <div key={item.playerID}>{item.longName}</div>
    //                 )) : null}
    //     </>
    // )
}

export default HomePlayers;
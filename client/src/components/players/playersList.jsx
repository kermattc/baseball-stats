import { Button } from 'react-bootstrap';
import { fetchPlayersList, fetchPlayerStats } from '../../store/utils/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { components } from 'react-select';

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
    
    // const CustomOption = ({ data, selectProps }) => (
    //     // <div {...innerProps}>
    //     <div>
    //       <span>{data.label}</span>
    //       <button onClick={(e) => selectProps.onButtonClick(data)}>Button</button>
    //     </div>
    // );
    
    // const CustomSelect = ({ options, onButtonClick}) => (
    //     <>
    //     {/* {console.log("...rest: ", {...rest})} */}
        
    //     <Select
    //     //   {...rest}
    //       options={options}
    //       components={{ Option: CustomOption }}
    //       onButtonClick={onButtonClick}
    //     />
    //     </>
    // );

    const handleClick = (event) => {
        console.log(event)
    }

    const CustomButton = ({ children, ...props }) => {
        return (
            <>
                {console.log("Children: ", children)}
            
                <button> test</button>
            </>    
        )   
    }

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
                    {/* <CustomSelect
                        options={playersList}
                        onButtonClick={(e) => handleClick(e)}
                    /> */}
                    <Select
                        value={selectedOption}
                        onChange={handleSelectedPlayer}
                        options={playersList}
                        components={{CustomButton}}
                    />
                </>
            ) : null}
        </>
    );
}

export default PlayersList;

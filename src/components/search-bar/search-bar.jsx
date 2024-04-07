import React, { useState } from 'react';
import Select from 'react-select';

const SearchDropdown = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div>
      <Select
        value={selectedOption}
        onChange={setSelectedOption}
        options={optionsArray}
      />
    </div>
  );
};

export default SearchDropdown;
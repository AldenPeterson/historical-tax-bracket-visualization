import React from 'react';
import Select from 'react-select';

import FilingStatuses from '../utilities/FilingStatus';

interface FilingDropdownProps {
    onChange: (value: string) => void;
}

const FilingDropdown: FC<FilingDropdownProps> = ({onChange}) => {
    const [selectedOption, setSelectedOption] = React.useState(null);
  
    const customStyles = {
        control: (provided) => ({
          ...provided,
          backgroundColor: '#f5f5f5',
          borderColor: '#e0e0e0',
          minHeight: '30px',
          height: '30px',
          boxShadow: 'none'
        }),
        menu: (provided) => ({
          ...provided,
          color: '#333',
          cursor: 'pointer',
        }),
        singleValue: (provided) => ({
          ...provided,
          color: '#333',
        }),
      };

      
    return (
      <Select
        value={selectedOption}
        onChange={onChange}
        options={FilingStatuses}
        styles={customStyles}
      />
    );
  };
  
  export default FilingDropdown;
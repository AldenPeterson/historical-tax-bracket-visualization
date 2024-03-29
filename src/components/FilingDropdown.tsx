import React, { FC } from 'react';
import Select from 'react-select';

import FilingStatuses from '../utilities/FilingStatus';
import { FilingStatusSelection } from '../types/FilingStatus';


import { inputStyle, labelStyle, inputDivStyle} from '../styles/styles';

interface FilingDropdownProps {
  value: {value: string, label: string};
  onChange: (option: FilingStatusSelection) => void;
}

const FilingDropdown: FC<FilingDropdownProps> = ({onChange}) => {
    const [selectedOption, setSelectedOption] = React.useState(FilingStatuses[0]);

    const customStyles = {
        control: () => ({
          backgroundColor: '#f5f5f5',
          borderColor: '#e0e0e0',
          boxShadow: 'none',
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center',
          ...inputStyle,
        }),
        menu: (provided: any) => ({
          ...provided,
          color: '#333',
          cursor: 'pointer',
        }),
        singleValue: (provided: any) => ({
          ...provided,
          color: '#333',
          textAlign: 'center',
          display: 'flex',
          
          alignItems: 'center',
        }),
        option: (provided: any) => ({
          ...provided,
          color: '#333',
          cursor: 'pointer',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
        })      
      };

    const handleOptionChange = (event:any) => {
      onChange(event);
      setSelectedOption(event.target)
  };

    return (
      <div style = {inputDivStyle}>
      <label style={labelStyle}>Filing Status</label>

        <Select
          value={selectedOption}
          onChange={handleOptionChange}
          options={FilingStatuses}
          styles={customStyles}
        />
      </div>

    );
  };
  
  export default FilingDropdown;
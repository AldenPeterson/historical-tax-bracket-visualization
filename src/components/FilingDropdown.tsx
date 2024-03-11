import React, { FC } from 'react';
import Select from 'react-select';

import FilingStatuses from '../utilities/FilingStatus';

interface FilingDropdownProps {
  value: {value: string, label: string};
  onChange: any;
}

const FilingDropdown: FC<FilingDropdownProps> = ({onChange}) => {
    const [selectedOption, setSelectedOption] = React.useState(null);

    const customStyles = {
        control: (provided: any) => ({
          ...provided,
          backgroundColor: '#f5f5f5',
          borderColor: '#e0e0e0',
          minHeight: '40px',
          height: '40px',
          boxShadow: 'none',
          width: '200px'
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
    const divStyle = {
      textAlign: 'left' as 'left',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '15px',
      paddingBottom: '15px',
    };
    const labelStyle = {
      paddingRight: '15px',
      midWidth: '250px',
      
    };
  
    return (
      <div style = {divStyle}>
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
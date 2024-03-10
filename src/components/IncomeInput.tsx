import React, { FC } from 'react';

interface InputBoxProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const InputBox: FC<InputBoxProps> = ({ value, onChange , label}) => {
  const inputStyle = {
    width: '200px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    textAlign: 'left' as 'left',
  };
  const divStyle = {
    textAlign: 'left' as 'left',
  };

  const labelStyle = {
    padding: '10px',
  };

  return (
    <div style = {divStyle}>
        <label style={labelStyle}>{label}</label>
        <input
        style={inputStyle}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        />
    </div>
  );
};

export default InputBox;
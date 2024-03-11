import { FC } from 'react';
import CurrencyInput from 'react-currency-input-field';

interface InputBoxProps {
  label: string;
  value: number;
  setIncome: (value: number) => void;
}


const InputBox: FC<InputBoxProps> = ({ value, setIncome , label}) => {
  const inputStyle = {
    width: '200px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    textAlign: 'left' as 'left',
  };
  const divStyle = {
    textAlign: 'left' as 'left',
    paddingTop: '15px',
    paddingBottom: '15px',
  };

  const labelStyle = {
    paddingRight: '15px',
    midWidth: '250px',
    paddingTop: '10px',
    paddingBottom: '10px',
  };

  const updateIncome = (value: string | undefined) => {
    if (value !== undefined) {
      setIncome(Number(value));
    }
    
  }

  return (
    <div style = {divStyle}>
        <label style={labelStyle}>{label}</label>
        <CurrencyInput
          style={inputStyle}
          allowDecimals={false}
          defaultValue={value}
          prefix={'$'}
          onValueChange={updateIncome}
          step={1000}
        />
    </div>
  );
};

export default InputBox;
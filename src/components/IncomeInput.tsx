import { FC } from 'react';
import CurrencyInput from 'react-currency-input-field';

import { inputStyle, labelStyle,inputDivStyle } from '../styles/styles';

interface InputBoxProps {
  label: string;
  value: number;
  setIncome: (value: number) => void;
}


const InputBox: FC<InputBoxProps> = ({ value, setIncome , label}) => {




  const updateIncome = (value: string | undefined) => {
    if (value !== undefined) {
      setIncome(Number(value));
    }
    
  }

  return (
    <div style = {inputDivStyle}>
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
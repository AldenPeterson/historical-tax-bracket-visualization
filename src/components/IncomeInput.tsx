import { FC } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useDebouncedCallback } from 'use-debounce';

import { inputStyle, labelStyle,inputDivStyle } from '../styles/styles';

interface InputBoxProps {
  label: string;
  defaultValue: number;
  setIncome: (value: number) => void;
}


const InputBox: FC<InputBoxProps> = ({ defaultValue, setIncome , label}) => {

  const debounced = useDebouncedCallback((value: string | undefined) => {
    if (value !== undefined) {
      setIncome(Number(value));
    }
  }
  , 350);


  return (
    <div style = {inputDivStyle}>
        <label style={labelStyle}>{label}</label>
        <CurrencyInput
          style={inputStyle}
          allowDecimals={false}
          defaultValue={defaultValue}
          prefix={'$'}
          onValueChange={debounced}
          step={1000}
        />
    </div>
  );
};

export default InputBox;
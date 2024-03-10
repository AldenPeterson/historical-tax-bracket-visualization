import { useState } from 'react'

import './App.css'

import TaxChart from './components/TaxChart'
import InputBox from './components/Input'

function App() {
  const [maxValue, setMaxValue] = useState(1000);


  return (
    <>

      <InputBox value={maxValue} label="Max Value" onChange={setMaxValue} />
      <TaxChart maxValue={maxValue} />


    </>
  )
}

export default App



import { useState } from 'react'

import './App.css'

import TaxChart from './components/TaxChart'
import InputBox from './components/IncomeInput'
import FilingDropdown from './components/FilingDropdown'

import FilingStatuses from './utilities/FilingStatus'

function App() {
  const [maxValue, setMaxValue] = useState(1000);
  const [filingStatus, setFilingStatus] = useState(FilingStatuses[0]);


  return (
    <>

      <InputBox value={maxValue} label="2024 Income" onChange={setMaxValue} />
      <FilingDropdown onChange={setFilingStatus}/>
      <TaxChart income={maxValue} filingStatus={filingStatus.value}/>


    </>
  )
}

export default App



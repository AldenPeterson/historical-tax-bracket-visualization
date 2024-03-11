import { useState } from 'react'

import './App.css'

import TaxChart from './components/TaxChart'
import InputBox from './components/IncomeInput'
import FilingDropdown from './components/FilingDropdown'

import FilingStatuses from './utilities/FilingStatus'

function App() {
  const [income, setIncome] = useState(75000  );
  const [filingStatus, setFilingStatus] = useState(FilingStatuses[0]);


  return (
    <>

      <InputBox value={income} label="2024 Income" setIncome={setIncome} />
      <FilingDropdown onChange={setFilingStatus}/>
      <TaxChart income={income} filingStatus={filingStatus}/>


    </>
  )
}

export default App



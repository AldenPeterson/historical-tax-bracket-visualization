import { useState } from 'react'

import './App.css'

import TaxChart from './components/TaxChart'
import InputBox from './components/IncomeInput'
import FilingDropdown from './components/FilingDropdown'

import FilingStatuses from './utilities/FilingStatus'

function App() {
  const [income, setIncome] = useState(75000);
  const [filingStatus, setFilingStatus] = useState(FilingStatuses[0]);


  return (
    <>
      <h1>Welcome to Historical Tax Rate Simulator</h1>
      <p style={{ textAlign: 'left' }}>Have you ever wondered what your current income would be taxed, at historical periods?

        By entering an income and selecting a filing status, you can see how much you would have been taxed based on historical tax brackets if those brackets were inflation adjusted.
      </p>
      <InputBox value={income} label="2024 Income" setIncome={setIncome} />
      <FilingDropdown value={filingStatus} onChange={setFilingStatus}/>
      <TaxChart income={income} filingStatus={filingStatus}/>


    </>
  )
}

export default App



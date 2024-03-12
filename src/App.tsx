import { useState } from "react";

import "./App.css";

import TaxChart from "./components/TaxChart";
import InputBox from "./components/IncomeInput";
import FilingDropdown from "./components/FilingDropdown";

import FilingStatuses from "./utilities/FilingStatus";
import CheckboxControl from "./components/CheckboxControl";

function App() {
  const [income, setIncome] = useState(75000);
  const [filingStatus, setFilingStatus] = useState(FilingStatuses[0]);
  const [includeSS, setIncludeSS] = useState(true);
  const [includeFederalIncome, setIncludeFederalIncome] = useState(true);
  const [showMarginalFederalRate, setShowMarginalFederalRate] = useState(true);
  const [showNetIncome, setShowNetIncome] = useState(true);
  const [includeMedicare, setIncludeMedicare] = useState(true);


  const config = {
    includeSS,
    includeFederalIncome,
    showMarginalFederalRate,
    showNetIncome,
    includeMedicare
  };
  

  return (
    <>
      <h1>Welcome to Historical Tax Rate Simulator</h1>
      <p style={{ textAlign: "left" }}>
        Have you ever wondered what your current income would be taxed, at
        historical periods? By entering an income and selecting a filing status,
        you can see how much you would have been taxed based on historical tax
        brackets if those brackets were inflation adjusted.
      </p>
      <InputBox value={income} label="2024 Income" setIncome={setIncome} />
      <FilingDropdown value={filingStatus} onChange={setFilingStatus} />
      <CheckboxControl
        label="Include Social Security?"
        checked={includeSS}
        onChange={() => setIncludeSS(!includeSS)}
      />      
      <CheckboxControl
      label="Include Medicare?"
      checked={includeSS}
      onChange={() => setIncludeMedicare(!includeMedicare)}
    />
      <CheckboxControl
        label="Include Federal Income?"
        checked={includeFederalIncome}
        onChange={() => setIncludeFederalIncome(!includeFederalIncome)}
      />
      <CheckboxControl
        label="Show Marginal Federal Rate?"
        checked={showMarginalFederalRate}
        onChange={() => setShowMarginalFederalRate(!showMarginalFederalRate)}
      />
      <CheckboxControl
        label="Show Net Income?"
        checked={showNetIncome}
        onChange={() => setShowNetIncome(!showNetIncome)}
      />

      <TaxChart
        income={income}
        filingStatus={filingStatus}
        config={config}
      />
    </>
  );
}

export default App;

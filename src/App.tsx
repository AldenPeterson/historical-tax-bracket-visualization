import { useState } from "react";

import "./App.css";

import TaxChart from "./components/TaxChart";
import InputBox from "./components/IncomeInput";
import FilingDropdown from "./components/FilingDropdown";

import FilingStatuses from "./utilities/FilingStatus";

function App() {
  const [income, setIncome] = useState(75000);
  const [filingStatus, setFilingStatus] = useState(FilingStatuses[0]);
  const [includeSS, setIncludeSS] = useState(true);
  const [includeFederalIncome, setIncludeFederalIncome] = useState(true);
  const [showMarginalFederalRate, setShowMarginalFederalRate] = useState(true);
  const [showNetIncome, setShowNetIncome] = useState(true);

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
      <div style={{ textAlign: "left" }}>
        <label>
          <input
            type="checkbox"
            checked={includeSS}
            onChange={() => setIncludeSS(!includeSS)}
          />
          Include Social Security?
        </label>
      </div>
      <div style={{ textAlign: "left" }}>
        <label>
          <input
            type="checkbox"
            checked={includeFederalIncome}
            onChange={() => setIncludeFederalIncome(!includeFederalIncome)}
          />
          Include Federal Income?
        </label>
      </div>
      <div style={{ textAlign: "left" }}>
        <label>
          <input
            type="checkbox"
            checked={showMarginalFederalRate}
            onChange={() => setShowMarginalFederalRate(!showMarginalFederalRate)}
          />
          Show Marginal Federal?
        </label>
      </div>
      <div style={{ textAlign: "left" }}>
        <label>
          <input
            type="checkbox"
            checked={showNetIncome}
            onChange={() => setShowNetIncome(!showNetIncome)}
          />
          Show net?
        </label>
      </div>
      <TaxChart
        income={income}
        filingStatus={filingStatus}
        includeSS={includeSS}
        includeFederalIncome={includeFederalIncome}
        showMarginalFederalRate={showMarginalFederalRate}
        showNetIncome={showNetIncome}
      />
    </>
  );
}

export default App;

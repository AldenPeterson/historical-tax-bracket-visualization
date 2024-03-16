import { useState, useEffect, useMemo } from "react";

import "./App.css";

import TaxChart from "./components/TaxChart";
import TaxDataTable from "./components/TaxDataTable";
import { getTaxData } from "./calculators/Data";
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
  const [showTakehomePay, setShowTakehomePay] = useState(true);
  const [includeMedicare, setIncludeMedicare] = useState(true);
  const [includeStandardDeductions, setIncludeStandardDeductions] =
    useState(true);

  const config = useMemo(
    () => ({
      includeSS,
      includeFederalIncome,
      showMarginalFederalRate,
      showTakehomePay,
      includeMedicare,
      includeStandardDeductions,
    }),
    [
      includeSS,
      includeFederalIncome,
      showMarginalFederalRate,
      showTakehomePay,
      includeMedicare,
      includeStandardDeductions,
    ]
  );
  useEffect(() => {
    setTaxData(getTaxData(income, filingStatus, config));
  }, [

    filingStatus,
    income,
    config
  ]);

  const [taxData, setTaxData] = useState(() => getTaxData(income, filingStatus, config));

  return (
    <>
      <h1>Welcome to Historical Tax Rate Simulator</h1>
      <p style={{ textAlign: "left" }}>
        Have you ever wondered what your current income would be taxed, at
        historical periods? By entering an income and selecting a filing status,
        you can see how much you would have been taxed based on historical tax
        brackets if those brackets were inflation adjusted.
      </p>
      <InputBox defaultValue={income} label="2024 Income" setIncome={setIncome} />
      <FilingDropdown value={filingStatus} onChange={setFilingStatus} />
      <CheckboxControl
        label="Include Social Security?"
        checked={includeSS}
        onChange={() => {
          setIncludeSS(!includeSS);
        }}
      />
      <CheckboxControl
        label="Include Medicare?"
        checked={includeMedicare}
        onChange={() => {
          setIncludeMedicare(!includeMedicare);
        }}
      />
      <CheckboxControl
        label="Include Federal Income?"
        checked={includeFederalIncome}
        onChange={() => {
          setIncludeFederalIncome(!includeFederalIncome);
        }}
      />
      <CheckboxControl
        label="Show Marginal Federal Rate?"
        checked={showMarginalFederalRate}
        onChange={() => {
          setShowMarginalFederalRate(!showMarginalFederalRate);
        }}
      />
      <CheckboxControl
        label="Show Takehome Pay?"
        checked={showTakehomePay}
        onChange={() => {
          setShowTakehomePay(!showTakehomePay);
        }}
      />

      <CheckboxControl
        label="Include Standard Deductions/Exemptions?"
        checked={includeStandardDeductions}
        onChange={() => {
          setIncludeStandardDeductions(!includeStandardDeductions);
        }}
      />
      <TaxChart
        taxData={taxData}
        income={income}
        filingStatus={filingStatus}
        config={config}
      />
      <TaxDataTable config={config} income={income} globalTaxData={taxData} />
    </>
  );
}

export default App;

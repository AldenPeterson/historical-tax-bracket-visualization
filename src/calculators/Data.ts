import {
  yearlyLabels,
  getTaxFreeIncome,
  getTaxDataset,
} from "../calculators/TaxCalculation";

import { TaxData } from "../types/TaxData";

const subtractTaxFromNetIncome = (netIncome: number[], taxes: number[]) => {
  for (let i = 0; i < netIncome.length; i++) {
    netIncome[i] -= taxes[i];
  }
};

export const getTaxData = (
  income: number,
  filingStatus: { value: string; label: string },
  config: {
    includeSS: boolean;
    includeFederalIncome: boolean;
    showMarginalFederalRate: boolean;
    showTakehomePay: boolean;
    includeMedicare: boolean;
    includeStandardDeductions: boolean;
  }
) => {
    console.log("getting tax data")
let taxData: TaxData = {
    years: yearlyLabels(),
    standardDeductions: null,
    medicare: null,
    socialSecurity: null,
    federalIncome: null,
    federalIncomeMarginal: null,
    takehomePay: null,
    taxableIncome: null,
};

let takehomePay = new Array(yearlyLabels().length).fill(income);
let taxableIncome = new Array(yearlyLabels().length).fill(income);
const exemptionCount = filingStatus.value === "single" ? 1 : 2;

  if (config.includeStandardDeductions) {
    const standardDeductions = getTaxFreeIncome(income, filingStatus.value, exemptionCount);
    taxableIncome = taxableIncome.map(
      (value, index) =>
        value -
        standardDeductions[index].standardDeduction -
        exemptionCount * standardDeductions[index].personalExemptions
    );
    taxData.standardDeductions = standardDeductions;
    taxData.taxableIncome = taxableIncome;
  }

  if (config.includeSS) {
    const ssTaxes = getTaxDataset(
      "socialSecurity",
      filingStatus.value,
      taxableIncome
    );
    subtractTaxFromNetIncome(takehomePay, ssTaxes.basic);
    taxData.socialSecurity = ssTaxes;
  }

  if (config.includeMedicare) {
    const medicareTaxes = getTaxDataset(
      "medicare",
      filingStatus.value,
      taxableIncome
    );

    subtractTaxFromNetIncome(takehomePay, medicareTaxes.basic);
    taxData.medicare = medicareTaxes;
  }

  if (config.includeFederalIncome) {
    const federalIncomeTaxes = getTaxDataset(
      "federalIncome",
      filingStatus.value,
      taxableIncome
    );

    subtractTaxFromNetIncome(takehomePay, federalIncomeTaxes.basic);
    taxData.federalIncome = federalIncomeTaxes;
  }

  if (config.showMarginalFederalRate) {
    const federalMarginalRate = getTaxDataset(
      "federalIncome",
      filingStatus.value,
      taxableIncome,
      true
    );
    taxData.federalIncomeMarginal = federalMarginalRate.basic;
  }

  taxData.takehomePay = takehomePay;

  return taxData;
};

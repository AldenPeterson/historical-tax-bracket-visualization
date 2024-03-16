import taxData from "../data/taxes.json";

import { TaxDataSeries } from "../types/TaxData";
import { TaxBracket } from "../types/TaxBracket";
import StandardDeductionAndExemptions from "../data/standard-deduction-exemptions.json";
import inflationMultipliers from "../data/inflation-multipliers.json";
import { Deduction } from "../types/Deduction";

interface InflationMultipliers {
  [year: string]: string;
}

export const yearlyLabels = () => {
  const uniqueYears = [
    ...new Set(taxData.map((item: TaxBracket) => Number(item.year))),
  ];
  const sortedYears = uniqueYears.sort((a, b) => Number(a) - Number(b));
  return sortedYears;
};

// Return the multiplier to get the get the
const inflationMultiplier = (targetYear: string | number) => {
  if (typeof targetYear === "number") {
    targetYear = String(targetYear);
  }
  return Number((inflationMultipliers as InflationMultipliers)[targetYear]);
};

export const getTaxFreeIncome = (
  income: number,
  filingStatus: string,
  exemptions: number
) => {
  let datasetSeries = new Array(yearlyLabels().length).fill(0);
  for (let index = 0; index < yearlyLabels().length; index++) {
    const year = yearlyLabels()[index];

    const inflationAdjustedIncome = inflationMultiplier(year) * income;
    const matchingYear = StandardDeductionAndExemptions.filter(
      (deduction: Deduction) => deduction.year === Number(year)
    )[0] as Deduction;

    const stdDeduction =
      filingStatus === "single" ? matchingYear.single : matchingYear.mfj;
    const individualExemption = matchingYear.exemption;

    
    // In 1950 - 1969, standard deduction was calculated as a % of income
    // while in 1970+ it was a fixed amount
    if (matchingYear.type === "percent") {
      datasetSeries[index] = {
        standardDeduction:
          Math.min(
            stdDeduction * inflationAdjustedIncome,
            matchingYear.max || 0
          ) / inflationMultiplier(year),
        personalExemptions:
          (individualExemption * exemptions) / inflationMultiplier(year),
      };
    } else
      datasetSeries[index] = {
        standardDeduction: stdDeduction / inflationMultiplier(year),
        personalExemptions:
          (individualExemption * exemptions) / inflationMultiplier(year),
      };

  }
  return datasetSeries;
};

export const getTaxDataset = (
  taxType: string,
  filingStatus: string,
  income: number[],
  marginalRate: boolean = false
) : TaxDataSeries => {
  let datasetSeries: TaxDataSeries = { basic: [], detailed: [] };

  for (let index = 0; index < yearlyLabels().length; index++) {
    const year = yearlyLabels()[index];

    // console.log("Filtering for year", year, "filing status", filingStatus, "and tax type", taxType)
    const matchingBrackets = taxData.filter(
      (taxBracket: TaxBracket) =>
        taxBracket.year === String(year) &&
        taxBracket.filingStatus == filingStatus &&
        taxBracket.taxType == taxType
    );

    // The last (unbounded) bracket is equal to ""
    matchingBrackets.sort((a: TaxBracket, b: TaxBracket) => {
      if (a.bracketMax === "") return 1;
      if (b.bracketMax === "") return -1;
      return parseFloat(a.bracketMax) - parseFloat(b.bracketMax);
    });

    let yearTaxOwed = 0;

    const yearInflationMultiplier = inflationMultiplier(year);
    const inflationAdjustedIncome = income[index] * yearInflationMultiplier;

    let currentBracketRate = 0;
    let detailedTaxInformation = [];

    for (let index = 0; index < matchingBrackets.length; index++) {
      let priorBracketMax = 0;
      const currentBracketMax = Number(matchingBrackets[index].bracketMax);
      currentBracketRate = Number(matchingBrackets[index].rate);
      if (index > 0) {
        priorBracketMax = Number(matchingBrackets[index - 1].bracketMax);
      }

      let bracketTaxOwed = 0;
      // At last (unbounded) bracket      
      if (index === matchingBrackets.length - 1) {
        bracketTaxOwed =
          (inflationAdjustedIncome - priorBracketMax) * currentBracketRate;
      }
      // income falls within current bracket
      else if (inflationAdjustedIncome <= currentBracketMax) {
        bracketTaxOwed =
          (inflationAdjustedIncome - priorBracketMax) * currentBracketRate;
      } 
      // income within next bracket
      else {
        bracketTaxOwed =
          (currentBracketMax - priorBracketMax) * currentBracketRate;
      }
      yearTaxOwed += bracketTaxOwed;
      detailedTaxInformation.push({
        nominalTaxBracketMax: currentBracketMax,
        realTaxBracketMax: currentBracketMax / yearInflationMultiplier,
        taxBracketRate: currentBracketRate,
        nominalTaxOwed: bracketTaxOwed,
        realTaxOwed: bracketTaxOwed / yearInflationMultiplier,
      })

      if(inflationAdjustedIncome <= currentBracketMax){
        break;
      }

    }
    yearTaxOwed = yearTaxOwed / yearInflationMultiplier;
    if (marginalRate) {
      datasetSeries.basic.push(currentBracketRate);
    } else {
      datasetSeries.basic.push(yearTaxOwed);
      datasetSeries.detailed.push(detailedTaxInformation);
    }
  }

  return datasetSeries;
};

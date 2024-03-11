import taxData from "../data/taxes.json";

import { TaxBracket } from "../types/TaxBracket";
import inflationMultipliers from "../data/inflation-multipliers.json";

interface InflationMultipliers {
  [year: string]: string;
}

export const yearlyLabels = () => {
  const uniqueYears = [...new Set(taxData.map((item: TaxBracket) => item.year))];
  console.log("unique years are", uniqueYears)
  const sortedYears = uniqueYears.sort((a, b) => Number(a) - Number(b))
  return sortedYears;
};

export const getTaxDataset = (
  taxType: string,
  filingStatus: string,
  income: number
) => {
  let taxesOwed: number[] = [];

  for (let year of yearlyLabels()) {
    // console.log("Filtering for year", year, "filing status", filingStatus, "and tax type", taxType)
    const matchingBrackets = taxData.filter(
        (taxBracket: TaxBracket) =>
          taxBracket.year === year &&
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


    const yearInflationMultiplier = Number((inflationMultipliers as InflationMultipliers)[year]);

    const inflationAdjustedIncome = income * yearInflationMultiplier;
    console.log("Inflation adjusted income for year", year, "is", inflationAdjustedIncome)
    for (let index = 0; index < matchingBrackets.length; index++) {
      let priorBracketMax = 0;
      const currentBracketMax = Number(matchingBrackets[index].bracketMax);
      const currentBracketRate = Number(matchingBrackets[index].rate);
      if (index > 0) {
        priorBracketMax = Number(matchingBrackets[index - 1].bracketMax);
      }
      if (index === matchingBrackets.length-1) {
        const bracketTaxOwed = (inflationAdjustedIncome - priorBracketMax) * currentBracketRate;
        yearTaxOwed += bracketTaxOwed;
      } else if (inflationAdjustedIncome <= currentBracketMax) {
        const incrementalTax = (inflationAdjustedIncome - priorBracketMax) * currentBracketRate;
        yearTaxOwed += incrementalTax;
        break;
      } else {
        const bracketTaxOwed =
          (currentBracketMax - priorBracketMax) * currentBracketRate;
        yearTaxOwed += bracketTaxOwed;
      }
    }
    yearTaxOwed = yearTaxOwed / yearInflationMultiplier;
    taxesOwed.push(yearTaxOwed);
  }

  return taxesOwed;
};



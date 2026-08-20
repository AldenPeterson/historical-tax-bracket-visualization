import taxData from "../data/taxes.json";

import { TaxDataSeries } from "../types/TaxData";
import { TaxBracket } from "../types/TaxBracket";
import StandardDeductionAndExemptions from "../data/standard-deduction-exemptions.json";
import inflationRates from "../data/inflation-multipliers.json";
import { Deduction } from "../types/Deduction";
import { InflationRate } from "../types/InflationRate";

export const yearlyLabels = () => {
  const uniqueYears = [
    ...new Set(taxData.map((item: TaxBracket) => Number(item.year))),
  ];
  const sortedYears = uniqueYears.sort((a, b) => Number(a) - Number(b));
  return sortedYears;
};

const rateByYear = new Map(
  (inflationRates as InflationRate[]).map((entry) => [entry.year, entry.inflationRate])
);

// "Today's dollars" is the most recent tax year in the dataset (e.g. 2026),
// entered and shown at face value with no adjustment of its own.
const anchorYear = () => Math.max(...yearlyLabels());

// Multipliers are chained backward one year at a time from the anchor year:
// factor(Y) = factor(Y + 1) / (1 + inflationRate(Y)). A year's own published
// rate is what pulls it below the year after it. Any year at or above the
// anchor (i.e. without a published rate yet, like the still-in-progress
// current year) is left at 1.0 - no adjustment until a real rate exists.
export const inflationMultiplier = (targetYear: string | number) => {
  const year = Number(targetYear);
  let factor = 1;
  for (let y = anchorYear() - 1; y >= year; y--) {
    const rate = rateByYear.get(y);
    if (rate === undefined) {
      throw new Error(`No inflation rate found for year ${y}`);
    }
    factor /= 1 + rate;
  }
  return factor;
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
      if (currentBracketRate > 0){
      detailedTaxInformation.push({
        nominalTaxBracketMax: currentBracketMax > 0 ? currentBracketMax : "N/A",
        realTaxBracketMax: currentBracketMax / yearInflationMultiplier > 0 ? currentBracketMax / yearInflationMultiplier : "N/A",
        taxBracketRate: currentBracketRate,
        nominalTaxOwed: bracketTaxOwed,
        realTaxOwed: bracketTaxOwed / yearInflationMultiplier,
      })
    }

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

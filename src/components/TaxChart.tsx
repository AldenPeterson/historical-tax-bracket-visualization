import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import {
  yearlyLabels,
  getTaxFreeIncome,
  getTaxDataset,
} from "../calculators/TaxCalculation";

import { hexToRGBA } from "../utilities/HexToRGBA";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

interface TaxChartProps {
  income: number;
  filingStatus: any;
  config: {
    includeSS: boolean;
    includeFederalIncome: boolean;
    showMarginalFederalRate: boolean;
    showTakehomePay: boolean;
    includeMedicare: boolean;
    includeStandardDeductions: boolean;
  };
}

export const options = (
  income: number,
  filingStatus: { value: string; label: string },
  showMarginalFederalRate: boolean,
  includeStandardDeductions: boolean
) => {
  let yScales: any = {
    x: {
      title: {
        display: true,
        text: "Month",
      },
    },
    y: {
      min: 0,
      max: income,
      stacked: true,
    },
  };

  if (showMarginalFederalRate) {
    yScales.y1 = {
      min: 0,
      max: 1,
      stacked: false,
      position: "right",
      title: {
        text: "Marginal rate",
        display: true,
      },
      ticks: {
        callback: function (value: number) {
          return (value * 100).toFixed(0) + "%";
        },
      },
    };
  }

  if (includeStandardDeductions) {
    yScales.y2 = {
      min: 0,
      max: income,
      display: false,
    };
  }

  return {
    type: 'line',
    responsive: true,
    scales: yScales,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Equivalent taxes owed for income \$${income.toLocaleString(
          "en-US"
        )} using inflation adjusted historical tax code, filing ${
          filingStatus.label
        }`,
      },
      tooltip: {
        mode: 'nearest' as const,
        axis: "x" as const,
        intersect: false,
        callbacks: {
          label: function (context: any) {
            var label = context.dataset.label || "";
            // Format marginal rates as %; everything else is dollars
            if (context.dataset.yAxisID === "y1") {
              if (context.parsed.y !== null) {
                label += ": " + (context.parsed.y * 100).toFixed(0) + "%";
              }
            } else {
              if (context.parsed.y !== null) {
                label +=
                  ": $" +
                  Math.round(Number(context.parsed.y)).toLocaleString("en-US");
              }
            }
            return label;
          },
        },
      },
    },
  };
};

const subtractTaxFromNetIncome = (netIncome: number[], taxes: number[]) => {
  for (let i = 0; i < netIncome.length; i++) {
    netIncome[i] -= taxes[i];
  }
};
export const data = (
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
  //https://www.learnui.design/tools/data-color-picker.html#palette
  const colors = [
    "#003f5c",
    "#444e86",
    "#955196",
    "#dd5182",
    "#ff6e54",
    "#ffa600",
  ];

  let datasets = [];
  let takehomePay = new Array(yearlyLabels().length).fill(income);
  let taxableIncome = new Array(yearlyLabels().length).fill(income);

  const exemptionCount = filingStatus.value === "single" ? 1 : 2;

  if (config.includeStandardDeductions) {
    const color = colors[colors.length-1];
    console.log(color)
    const standardDeductions = getTaxFreeIncome(income, filingStatus.value, 1);
    taxableIncome = taxableIncome.map(
      (value, index) =>
        value -
        standardDeductions[index].standardDeduction -
        exemptionCount * standardDeductions[index].personalExemptions
    );
    datasets.push({
      label: `Taxable Income`,
      data: taxableIncome,
      borderColor: color,
      backgroundColor: color,
      fill: "false",
      pointRadius: 0,
      order: -1,
      yAxisID: "y2",
    });
  }

  if (config.includeSS) {
    const color = colors[0];
    const ssTaxes = getTaxDataset(
      "socialSecurity",
      filingStatus.value,
      taxableIncome
    );
    datasets.push({
      label: "SS Taxes",
      data: ssTaxes,
      borderColor: color,
      backgroundColor: color,
      fill: true,
      pointRadius: 0,
      borderWidth: 1,
    });

    subtractTaxFromNetIncome(takehomePay, ssTaxes);
  }
  if (config.includeMedicare) {
    const color = colors[1];
    const medicareTaxes = getTaxDataset(
      "medicare",
      filingStatus.value,
      taxableIncome
    );
    datasets.push({
      label: "Medicare",
      data: medicareTaxes,
      borderColor: color,
      backgroundColor: color,
      fill: true,
      pointRadius: 0,
      borderWidth: 1,
    });

    subtractTaxFromNetIncome(takehomePay, medicareTaxes);
  }

  if (config.includeFederalIncome) {
    const color = colors[2];
    const federalIncomeTaxes = getTaxDataset(
      "federalIncome",
      filingStatus.value,
      taxableIncome
    );
    datasets.push({
      label: `Federal Income Taxes`,
      data: federalIncomeTaxes,
      borderColor: color,
      backgroundColor: color,
      fill: true,
      pointRadius: 0,
      borderWidth: 1,
    });

    subtractTaxFromNetIncome(takehomePay, federalIncomeTaxes);
  }


  if (config.showTakehomePay) {
    const color = colors[3];
    datasets.push({
      label: `Takehome Pay`,
      data: takehomePay,
      borderColor: hexToRGBA(color, 0.15),
      backgroundColor: hexToRGBA(color, 0.15),
      fill: true,
      pointRadius: 0,
    });
  }


  if (config.showMarginalFederalRate) {
    const color = colors[colors.length-2];
    datasets.push({
      label: `Federal Marginal Rate`,
      data: getTaxDataset(
        "federalIncome",
        filingStatus.value,
        taxableIncome,
        true
      ),
      borderColor: color,
      backgroundColor: color,
      fill: "false",
      yAxisID: "y1",
      pointRadius: 0,
      order: -1,
    });
  }

  return {
    labels: yearlyLabels(),
    datasets: datasets,
  };
};

const TaxChart: React.FC<TaxChartProps> = ({
  income,
  filingStatus,
  config,
}) => {
  return (
    <div style={{ height: "750px", width: "1200px" }}>
      <Line
        data={data(income, filingStatus, config)}
        options={options(
          income,
          filingStatus,
          config.showMarginalFederalRate,
          config.includeStandardDeductions
        )}
      />
    </div>
  );
};

export default TaxChart;

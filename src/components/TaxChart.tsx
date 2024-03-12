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
import { yearlyLabels, getTaxDataset } from "../calculators/TaxCalculation";

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
    showNetIncome: boolean;
    includeMedicare: boolean;
  }

}

export const options = (
  income: number,
  filingStatus: { value: string; label: string },
  showMarginalFederalRate: boolean
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

  return {
    type: "line",
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
  console.log(netIncome, taxes);
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
    showNetIncome: boolean;
    includeMedicare: boolean;
  }

) => {
  let datasets = [];
  let netIncome = new Array(yearlyLabels().length).fill(income);
  //https://www.learnui.design/tools/data-color-picker.html#palette
  const colors = ["#003f5c", "#58508d", "#bc5090", "#ff6361", "#ffa600"];

  if (config.includeSS) {
    const color = colors[0];
    const ssTaxes = getTaxDataset("socialSecurity", filingStatus.value, income);
    datasets.push({
      label: "SS Taxes",
      data: ssTaxes,
      borderColor: color,
      backgroundColor: color,
      fill: true,
      pointRadius: 0,
      borderWidth: 1,
    });

    subtractTaxFromNetIncome(netIncome, ssTaxes);
  }
  console.log(config)
  if (config.includeMedicare) {
    const color = colors[1];
    const medicareTaxes = getTaxDataset("medicare", filingStatus.value, income);
    console.log("medicare" +  medicareTaxes)
    datasets.push({
      label: "Medicare",
      data: medicareTaxes,
      borderColor: color,
      backgroundColor: color,
      fill: true,
      pointRadius: 0,
      borderWidth: 1,
    });

    subtractTaxFromNetIncome(netIncome, medicareTaxes);
  }

  if (config.includeFederalIncome) {
    const color = colors[2];
    const federalIncomeTaxes = getTaxDataset(
      "federalIncome",
      filingStatus.value,
      income
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

    subtractTaxFromNetIncome(netIncome, federalIncomeTaxes);
  }

  if (config.showMarginalFederalRate) {
    const color = colors[4];
    datasets.push({
      label: `Federal Marginal Rate`,
      data: getTaxDataset("federalIncome", filingStatus.value, income, true),
      borderColor: color,
      backgroundColor: color,
      fill: "false",
      yAxisID: "y1",
      pointRadius: 0,
      z:1
    });
  }

  if (config.showNetIncome) {
    const color = colors[3];
    datasets.push({
      label: `Net Income`,
      data: netIncome,
      borderColor: hexToRGBA(color, 0.15),
      backgroundColor: hexToRGBA(color, 0.15),
      fill: true,
      pointRadius: 0,
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
  config
}) => {
  return (
    <div style={{ height: "750px", width: "1200px" }}>
      <Line
        data={data(
          income,
          filingStatus,
          config

        )}
        options={options(income, filingStatus, config.showMarginalFederalRate)}
      />
    </div>
  );
};

export default TaxChart;

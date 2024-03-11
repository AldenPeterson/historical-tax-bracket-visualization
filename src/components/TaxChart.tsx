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
  includeSS: boolean;
  includeFederalIncome: boolean;
  showMarginalFederalRate: boolean;
}

export const options = (
  income: number,
  filingStatus: { value: string; label: string },
  showMarginalFederalRate: boolean
) => {
  let yScales = {};

  yScales.y = {
    min: 0,
    max: income,
    stacked: true,
  };

  if (showMarginalFederalRate) {
    yScales.y1 = {
      min: 0,
      max: 1,
      stacked: false,
      position: "right",
      title: {
        text:"Marginal rate",
        display:true
      },
      ticks: {
        callback: function (value: number) {
          return (value * 100).toFixed(0) + "%";
        },
      },
    };
  }

  console.log(yScales);
  return {
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
                label += ": $" + Math.round(Number(context.parsed.y)).toLocaleString(
                  "en-US"
                )

              }
            }
            return label;
          },
        },
      },
    },
  };
};

export const data = (
  income: number,
  filingStatus: { value: string; label: string },
  includeSS: boolean,
  includeFederalIncome: boolean,
  showMarginalFederalRate: boolean
) => {
  console.log(yearlyLabels);
  const includeNetIncome = true;
  let datasets = [];
  if (includeSS) {
    datasets.push({
      label: "SS Taxes",
      data: getTaxDataset("socialSecurity", filingStatus.value, income),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      fill: true,
      pointRadius: 0,
    });
  }
  if (includeFederalIncome) {
    datasets.push({
      label: `Federal Income Taxes`,
      data: getTaxDataset("federalIncome", filingStatus.value, income),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      fill: "origin",
      pointRadius: 0,
    });
  }

  if (showMarginalFederalRate) {
    datasets.push({
      label: `Federal Marginal Rate`,
      data: getTaxDataset("federalIncome", filingStatus.value, income, true),
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgb(75, 192, 192)",
      fill: "false",
      yAxisID: "y1",
      pointRadius: 0,
    });
  }

  if (includeNetIncome) {
  }
  return {
    labels: yearlyLabels(),
    datasets: datasets,
  };
};

const TaxChart: React.FC<TaxChartProps> = ({
  income,
  filingStatus,
  includeSS,
  includeFederalIncome,
  showMarginalFederalRate,
}) => {
  return (
    <div style={{ height: "750px", width: "1200px" }}>
      <Line
        data={data(
          income,
          filingStatus,
          includeSS,
          includeFederalIncome,
          showMarginalFederalRate
        )}
        options={options(income, filingStatus, showMarginalFederalRate)}
      />
    </div>
  );
};

export default TaxChart;

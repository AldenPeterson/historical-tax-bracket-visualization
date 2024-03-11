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
}

export const options = (income: number, filingStatus: string) => {
  return {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: income,
        stacked: true,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Equivalent taxes owed for income \$${income.toLocaleString('en-US')} using inflation adjusted historical tax code, filing ${filingStatus.label}`,
      },
    },
  };
};

export const data = (income: number, filingStatus: string) => {
  // const ssTaxes = getTaxDataset(income, filingStatus.value, ssBrackets);
console.log(yearlyLabels)
  return {
    labels: yearlyLabels(),
    datasets: [
      {
        label: "SS Taxes",
        data: getTaxDataset("socialSecurity", filingStatus.value, income),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        fill: true,
      },
      {
        label: `Federal Income Taxes ${filingStatus.label}`,
        data: getTaxDataset("federalIncome", filingStatus.value, income),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: "origin",
      },
    ],
  };
};

const TaxChart: React.FC<TaxChartProps> = ({ income, filingStatus }) => {
  return (
    <div style={{ height: "750px", width: "1200px" }}>
      <Line
        data={data(income, filingStatus)}
        options={options(income, filingStatus)}
      />
    </div>
  );
};

export default TaxChart;

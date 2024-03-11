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
}

export const options = (income: number, filingStatus: { value: string, label: string }) => {
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

export const data = (income: number, filingStatus: { value: string, label: string }, includeSS: boolean, includeFederalIncome: boolean) => {
console.log(yearlyLabels)
let datasets = []
if (includeSS) {
  datasets.push({
      label: "SS Taxes",
      data: getTaxDataset("socialSecurity", filingStatus.value, income),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      fill: true,
  })
}
if (includeFederalIncome) {

  datasets.push({ 
    label: `Federal Income Taxes ${filingStatus.label}`,
    data: getTaxDataset("federalIncome", filingStatus.value, income),
    borderColor: "rgb(255, 99, 132)",
    backgroundColor: "rgba(255, 99, 132, 0.5)",
    fill: "origin",
  })
}
  return {
    labels: yearlyLabels(),
    datasets:datasets
  };
};

const TaxChart: React.FC<TaxChartProps> = ({ income, filingStatus, includeSS, includeFederalIncome}) => {
  return (
    <div style={{ height: "750px", width: "1200px" }}>
      <Line
        data={data(income, filingStatus, includeSS, includeFederalIncome)}
        options={options(income, filingStatus)}
      />
    </div>
  );
};

export default TaxChart;

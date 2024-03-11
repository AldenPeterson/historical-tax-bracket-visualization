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
import incomeTaxBrackets from "../data/income.json";
import ssBrackets from "../data/social-security.json";

import getTaxDataset from "../calculators/income";

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
        min:0,
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
        text: `Taxes owed for ${filingStatus.label} and income ${income}`,
      },
    },
  };
};

export const data = (income: number, filingStatus: string) => {
  const incomeTaxes = getTaxDataset(
    income,
    filingStatus.value,
    incomeTaxBrackets
  );
  const ssTaxes = getTaxDataset(income, filingStatus.value, ssBrackets);
  return {
    labels: incomeTaxes.labels,
    datasets: [
     
      {
        label: "SS Taxes",
        data: ssTaxes.values,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        fill: true,
      },
      {
        label: `Federal Income Taxes ${filingStatus.label}`,
        data: incomeTaxes.values,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: "origin",
      }
    ],
  };
};

const TaxChart: React.FC<TaxChartProps> = ({ income, filingStatus }) => {
  return (
    <div style={{ height: "500px", width: "800px" }}>
      <Line
        data={data(income, filingStatus)}
        options={options(income, filingStatus)}
      />
    </div>
  );
};

export default TaxChart;

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
import incomeTaxBrackets from '../data/income.json';
import ssBrackets from '../data/social-security.json'

import getTaxDataset from '../calculators/income';

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

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};


export const data = (income: number, filingStatus: string) => {
  const incomeTaxes = getTaxDataset(income, filingStatus, incomeTaxBrackets);
  return {
    labels: incomeTaxes.labels,
    datasets: [
    {
      label: `Dataset 1 ${filingStatus}`,
      data: incomeTaxes.values,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      fill: "origin",
    },
    // {
    //   label: "Dataset 2",
    //   data: getTaxDataset(income, filingStatus, ssBrackets),
    //   borderColor: "rgb(53, 162, 235)",
    //   backgroundColor: "rgba(53, 162, 235, 0.5)",
    //   fill: true,
    // },
  ],
}
};

const TaxChart: React.FC<TaxChartProps> = ({ income, filingStatus }) => {
  return (
      <div style={{ height: "500px", width: "800px" }}>
        <Line data={data(income, filingStatus)} options={options} />
      </div>

  );
};

export default TaxChart;

import React from 'react';
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
} from 'chart.js';


import { Line } from 'react-chartjs-2';
import faker from 'faker';

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
    maxValue: number;
  }
  
  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
  export const data = (maxValue: number) => ({
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => faker.datatype.number({ min: 0, max: maxValue })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        fill: 'origin',
      },
    {
        label: 'Dataset 2',
        data: labels.map(() => faker.datatype.number({ min: 0, max: maxValue } as { min: number, max: number })),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        fill: true,
    },
    ],
   });

  const TaxChart: React.FC<TaxChartProps> = ({ maxValue }) => {
    return (
        <div style={{ height: '500px', width: '800px' }}>
          <Line data={data(maxValue)} options={options} />
        </div>
      );
};
  
  export default TaxChart;
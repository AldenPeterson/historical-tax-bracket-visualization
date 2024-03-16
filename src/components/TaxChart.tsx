import React from "react";
import { useMemo, useState, useEffect } from "react";
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

import { hexToRGBA } from "../utilities/HexToRGBA";

import { TaxData } from "../types/TaxData";

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
  taxData: TaxData;
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



const TaxChart: React.FC<TaxChartProps> = ({
  taxData,
  income,
  filingStatus,
  config,
}) => {

  const data = useMemo(
    () =>{
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
  
      if (taxData.standardDeductions) {
        const color = colors[colors.length - 1];
        datasets.push({
          label: `Taxable Income`,
          data: taxData.taxableIncome,
          borderColor: color,
          backgroundColor: color,
          fill: "false",
          pointRadius: 0,
          order: -1,
          yAxisID: "y2",
        });
      }
  
      if (taxData.socialSecurity) {
        const color = colors[0];
        datasets.push({
          label: "SS Taxes",
          data: taxData.socialSecurity.basic,
          borderColor: color,
          backgroundColor: color,
          fill: true,
          pointRadius: 0,
          borderWidth: 1,
        });
      }
      if (taxData.medicare) {
        const color = colors[1];
        datasets.push({
          label: "Medicare",
          data: taxData.medicare.basic,
          borderColor: color,
          backgroundColor: color,
          fill: true,
          pointRadius: 0,
          borderWidth: 1,
        });
      }
  
      if (taxData.federalIncome) {
        const color = colors[2];
        datasets.push({
          label: `Federal Income Taxes`,
          data: taxData.federalIncome.basic,
          borderColor: color,
          backgroundColor: color,
          fill: true,
          pointRadius: 0,
          borderWidth: 1,
        });
      }
  
      if (taxData.takehomePay) {
        const color = colors[3];
        datasets.push({
          label: `Takehome Pay`,
          data: taxData.takehomePay,
          borderColor: hexToRGBA(color, 0.15),
          backgroundColor: hexToRGBA(color, 0.15),
          fill: true,
          pointRadius: 0,
        });
      }
  
      if (taxData.federalIncomeMarginal) {
        const color = colors[colors.length - 2];
        datasets.push({
          label: `Federal Marginal Rate`,
          data: taxData.federalIncomeMarginal,
          borderColor: color,
          backgroundColor: color,
          fill: "false",
          yAxisID: "y1",
          pointRadius: 0,
          order: -1,
        });
      }
  
      return {
        labels: taxData.years,
        datasets: datasets,
      };
    },
    [taxData, config, filingStatus, income]
  );


  const options = useMemo(() => {

    let yScales: any = {
      x: {
        title: {
          display: true,
          text: "year",
        },
      },
      y: {
        min: 0,
        max: income,
        stacked: true,
      },
    };
    
    if (config.showMarginalFederalRate) {
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
  
    if (config.includeStandardDeductions) {
      yScales.y2 = {
        min: 0,
        max: income,
        display: false,
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
          mode: "nearest" as const,
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
  }, [taxData, config, filingStatus, income]);

  const [chartConfig, setChartConfig] = useState({ data: data, options: options });

  useEffect(() => {
    setChartConfig({ data, options });

  }, [data, options]);
  
  return (
    <div style={{ height: "750px", width: "1200px" }}>
      <Line
        data={chartConfig.data}
        options={chartConfig.options}
      />
    </div>
  );
};

export default TaxChart;

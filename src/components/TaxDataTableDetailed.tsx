import { TaxData } from "../types/TaxData";
import { toUSD } from "../utilities/Formatters";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { currencyTemplate, percentageTemplate } from "../utilities/Formatters";

import { inflationMultiplier } from "../calculators/TaxCalculation";

interface TaxDataTableProps {
  config: any;
  income: number;
  globalTaxData: TaxData;
  data: any;
}

const TaxDataTableDetailed: React.FC<TaxDataTableProps> = ({
  config,
  income,
  data,
  globalTaxData,
}) => {
  const yearIndex = globalTaxData.years.indexOf(data.year);
  const currentYear = new Date().getFullYear();
  const inflationFactor = inflationMultiplier(data.year);

  const detailedDataColumns = (currentYear: number, nominalYear: number) => {
    return [
      <Column
        field="taxBracketRate"
        header="Tax Rate"
        body={percentageTemplate("taxBracketRate")}
      ></Column>,
      <Column
        field="nominalTaxBracketMax"
        header={`Bracket Max (${nominalYear})`}
        body={currencyTemplate("nominalTaxBracketMax")}
      ></Column>,
      <Column
        field="realTaxBracketMax"
        header={`Bracket Max (${currentYear})`}
        body={currencyTemplate("realTaxBracketMax")}
      ></Column>,
      <Column
        field="nominalTaxOwed"
        header={`"Bracket Tax Owed (${nominalYear})`}
        body={currencyTemplate("nominalTaxOwed")}
      ></Column>,
      <Column
        field="realTaxOwed"
        header={`Bracket Tax Owed (${currentYear})`}
        body={currencyTemplate("realTaxOwed")}
      ></Column>,
    ];
  };

  const createDetailedTaxTable = (header: string, data: any, columns: any) => {
    return (
      <div>
        <DataTable value={data} header={header} stripedRows>
          {columns.map((column: any) => column)}{" "}
        </DataTable>
        <br></br>
      </div>
    );
  };

  // Mapping between config and the actual detailed variable name
  const configTaxTableMapping = () => {
    return {
      includeFederalIncome: "federalIncome",
      includeSS: "socialSecurity",
      includeMedicare: "medicare",
    };
  };

  const generateDetailedTaxTables = (
    globalTaxData: any,
    yearIndex: number,
    config: any
  ) => {
    interface ConfigMapping {
      [key: string]: string;
    }

    const configDetailedHeadingMapping = (): ConfigMapping => {
      return {
        includeFederalIncome: "Federal Income",
        includeSS: "Social Security",
        includeMedicare: "Medicare",
      };
    };

    let taxTables = [];

    for (const [key, value] of Object.entries(configTaxTableMapping())) {
      if (config[key]) {
        taxTables.push(
          createDetailedTaxTable(
            configDetailedHeadingMapping()[key],
            globalTaxData[value]["detailed"][yearIndex],
            detailedDataColumns(currentYear, data.year)
          )
        );
      }
    }
    return taxTables;
  };


  return (
    <div>
      <div
        className="detailed-view"
        style={{
          lineHeight: "1",
          textAlign: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p>
          {currentYear} income: {toUSD(income)}
        </p>
        <p>
          {data.year} income: {toUSD(income * inflationFactor)}
        </p>
        <p>
          {data.year} inflation multiplier: {inflationFactor}
        </p>
      </div>
      <div>
        {generateDetailedTaxTables(globalTaxData, yearIndex, config).map(
          (table: any) => table
        )}
      </div>
    </div>
  );
};

export default TaxDataTableDetailed;

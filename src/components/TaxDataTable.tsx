import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { TaxData } from "../types/TaxData";

import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

interface TaxDataTableProps {
  globalTaxData: TaxData;
}

const TaxDataTable: React.FC<TaxDataTableProps> = ({ globalTaxData }) => {
  let rawDataTable = [];
  for (let i = 0; i < globalTaxData.years.length; i++) {
    rawDataTable.push({
      id: i + 1,
      year: globalTaxData.years[i],
      standardDeductions: globalTaxData.standardDeductions
        ? globalTaxData.standardDeductions[i].standardDeduction
        : null,
      personalExemptions: globalTaxData.standardDeductions
        ? globalTaxData.standardDeductions[i].personalExemptions
        : null,
      medicare: globalTaxData.medicare ? globalTaxData.medicare.basic[i] : null,
      socialSecurity: globalTaxData.socialSecurity
        ? globalTaxData.socialSecurity.basic[i]
        : null,
      federalIncome: globalTaxData.federalIncome
        ? globalTaxData.federalIncome.basic[i]
        : null,
      federalIncomeMarginal: globalTaxData.federalIncomeMarginal
        ? globalTaxData.federalIncomeMarginal[i]
        : null,
      takehomePay: globalTaxData.takehomePay
        ? globalTaxData.takehomePay[i]
        : null,
      taxableIncome: globalTaxData.taxableIncome
        ? globalTaxData.taxableIncome[i]
        : null,
    });
  }

  let columns = [];

  columns.push({ field: "year", header: "Year" });

  const currencyTemplate = (field: string) => {
    return (rowData: any) => {
      return Math.floor(rowData[field]).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });
    };
  };
  if (globalTaxData.standardDeductions) {
    columns.push({
      header: "Standard Deductions",
      field: "standardDeductions",
      type: "currency",
      body: currencyTemplate,
    });
    columns.push({
      header: "Personal Exemptions",
      field: "personalExemptions",
      type: "currency",
      body: currencyTemplate,
    });
  }
  if (globalTaxData.medicare) {
    columns.push({
      header: "Medicare",
      field: "medicare",
      type: "currency",
      body: currencyTemplate,
    });
  }
  if (globalTaxData.socialSecurity) {
    columns.push({
      header: "Social Security",
      field: "socialSecurity",
      type: "currency",
      body: currencyTemplate,
    });
  }
  if (globalTaxData.federalIncome) {
    columns.push({
      header: "Federal Income",
      field: "federalIncome",
      type: "currency",
      body: currencyTemplate,
    });
  }
  if (globalTaxData.federalIncomeMarginal) {
    columns.push({
      header: "Federal Income Marginal",
      field: "federalIncomeMarginal",
    });
  }
  if (globalTaxData.takehomePay) {
    columns.push({
      header: "Takehome Pay",
      field: "takehomePay",
      type: "currency",
      body: currencyTemplate,
    });
  }
  if (globalTaxData.taxableIncome) {
    columns.push({
      header: "Taxable Income",
      field: "taxableIncome",
      type: "currency",
      body: currencyTemplate,
    });
  }

  return (
    <div className="card">
      <DataTable value={rawDataTable} showGridlines stripedRows size="small">
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            body={col.body ? col.body(col.field) : null}
            sortable
          />
        ))}
      </DataTable>
    </div>
  );
};

export default TaxDataTable;

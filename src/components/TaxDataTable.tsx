import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";


import { currencyTemplate, percentageTemplate } from "../utilities/Formatters";
import TaxDataTableDetailed from "./TaxDataTableDetailed";

import { TaxData } from "../types/TaxData";

// import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import React from "react";

interface TaxDataTableProps {
  config: any;
  income: number;
  globalTaxData: TaxData;
}

const TaxDataTable: React.FC<TaxDataTableProps>  = React.memo(({
  config,
  income,
  globalTaxData,
}) => {
  const [expandedRows, setExpandedRows] = React.useState<any>(null);
  //   const [tableData, setTableData] = React.useState<any>(null);

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
      body: percentageTemplate
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

  const rowExpansionTemplate = (data: any) => {
    console.log(data, globalTaxData);
    return (
      <TaxDataTableDetailed
        config={config}
        income={income}
        data={data}
        globalTaxData={globalTaxData}
      />
    );
  };

  //   const expandAll = () => {
  //     let _expandedRows = {};

  //     console.log(rawDataTable);
  //     rawDataTable.forEach((d) => (_expandedRows[`${d.id}`] = true));

  //     setExpandedRows(_expandedRows);
  //   };

  //   const collapseAll = () => {
  //     setExpandedRows(null);
  //   };

  //   const header = (
  //     <div className="flex flex-wrap justify-content-end gap-2">
  //       <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
  //       <Button
  //         icon="pi pi-minus"
  //         label="Collapse All"
  //         onClick={collapseAll}
  //         text
  //       />
  //     </div>
  //   );

  return (
    // <div className="card">
      <DataTable
        value={rawDataTable}
        sortField="year"
        sortOrder={-1}
        showGridlines
        stripedRows
        size="small"
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        // header={header}
      >
        <Column expander />
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
  );
});

export default TaxDataTable;

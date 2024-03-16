
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid


import { TaxData } from "../types/TaxData";

interface TaxDataTableProps {
    globalTaxData: TaxData
}

const TaxDataTable:React.FC<TaxDataTableProps> = ({globalTaxData}) => {

    let rawDataTable = []
    for (let i = 0; i < globalTaxData.years.length; i++) {

        rawDataTable.push({
            id: i+1,
            year: globalTaxData.years[i],
            standardDeductions: globalTaxData.standardDeductions ? globalTaxData.standardDeductions[i].standardDeduction : null,
            personalExemptions: globalTaxData.standardDeductions ? globalTaxData.standardDeductions[i].personalExemptions : null,
            medicare: globalTaxData.medicare ? globalTaxData.medicare[i] : null,
            socialSecurity: globalTaxData.socialSecurity ? globalTaxData.socialSecurity[i] : null,
            federalIncome: globalTaxData.federalIncome ? globalTaxData.federalIncome[i] : null,
            federalIncomeMarginal: globalTaxData.federalIncomeMarginal ? globalTaxData.federalIncomeMarginal[i] : null,
            takehomePay: globalTaxData.takehomePay ? globalTaxData.takehomePay[i] : null,
            taxableIncome: globalTaxData.taxableIncome ? globalTaxData.taxableIncome[i] : null
        });
    }

    console.log(rawDataTable.length)
    let columns = []

    columns.push(
        {field:"year", headerName:"Year"}
    )

    
    const formatUSD = (p) => '$' + Math.floor(p.value).toLocaleString() 

    if (globalTaxData.standardDeductions) {
        columns.push({headerName: "Standard Deductions", field: "standardDeductions", valueFormatter: formatUSD});
        columns.push({headerName: "Personal Exemptions", field: "personalExemptions", valueFormatter: formatUSD});
    }
    if (globalTaxData.medicare) {
        columns.push({headerName: "Medicare", field: "medicare", valueFormatter: formatUSD});
    }
    if (globalTaxData.socialSecurity) {
        columns.push({headerName: "Social Security", field: "socialSecurity", valueFormatter: formatUSD});
    }
    if (globalTaxData.federalIncome) {
        columns.push({headerName: "Federal Income", field: "federalIncome", valueFormatter: formatUSD});
    }
    if (globalTaxData.federalIncomeMarginal) {
        columns.push({headerName: "Federal Income Marginal", field: "federalIncomeMarginal"});
    }
    if (globalTaxData.takehomePay) {
        columns.push({headerName: "Takehome Pay", field: "takehomePay", valueFormatter: formatUSD});
    }  
    if (globalTaxData.taxableIncome) {
        columns.push({headerName: "Taxable Income", field: "taxableIncome", valueFormatter: formatUSD});
    }

      return (
        <div
        className="ag-theme-quartz" // applying the grid theme
        style={{ height: 500 }} // the grid will fill the size of the parent container
       >
         <AgGridReact
             rowData={rawDataTable}
             columnDefs={columns as any}
         />
       </div>
     

      )
    
}

export default TaxDataTable
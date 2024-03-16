
import { TaxData } from "../types/TaxData";

import { Card } from "primereact/card";

interface TaxDataTableProps {
    globalTaxData: TaxData;
    data: any;
}

const TaxDataTableDetailed: React.FC<TaxDataTableProps> = ({
  data, globalTaxData
}) => {
    console.log(data)
    console.log(globalTaxData);
    const index = globalTaxData.years.indexOf(data.year);
    console.log(globalTaxData.federalIncome?.detailed[index])

    return (
        <Card title={data.name} style={{ textAlign: "center" }}>
          <p>{`Details for ${
              globalTaxData.federalIncome?.detailed[index]
              }`}</p>
          
        </Card>
      );

};

export default TaxDataTableDetailed;

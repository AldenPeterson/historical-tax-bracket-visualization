export const toUSD = (value: number) => {
        return Math.floor(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
}

// For use in converting table rows to USD
export const currencyTemplate = (field: string) => {
    return (rowData: any) => {
      return toUSD(rowData[field]);
    };
  };

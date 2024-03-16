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
      if (typeof rowData[field] === 'string') {
        return rowData[field];
      }
      return toUSD(rowData[field]);
    };
};

export const percentageTemplate = (field: string) => {
    return (rowData: any) => {
      return `${(rowData[field] * 100).toFixed(2)}%`;
    };
};

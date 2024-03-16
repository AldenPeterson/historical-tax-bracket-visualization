export type TaxDataSeries = {
    basic: number[];
    detailed: any;
}

export type TaxData = {
    years: number[];
    standardDeductions: {standardDeduction: Number, personalExemptions: Number}[] | null;
    medicare: TaxDataSeries | null;
    socialSecurity: TaxDataSeries | null;
    federalIncome: TaxDataSeries | null;
    federalIncomeMarginal: number[] | null;
    takehomePay: number[] | null;
    taxableIncome: number[] | null;
  };
  
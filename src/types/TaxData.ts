export type TaxDataSeries = {
    basic: number[];
    detailed: any;
}

export interface TaxData {
    years: number[];
    standardDeductions: { standardDeduction: number, personalExemptions: number }[] | null;
    medicare: TaxDataSeries | null;
    socialSecurity: TaxDataSeries | null;
    federalIncome: TaxDataSeries | null;
    federalIncomeMarginal: number[] | null;
    takehomePay: number[] | null;
    taxableIncome: number[] | null;
}
  
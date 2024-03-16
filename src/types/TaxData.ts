export type TaxData = {
    years: number[];
    standardDeductions: number[] | null;
    medicare: number[] | null;
    socialSecurity: number[] | null;
    federalIncome: number[] | null;
    federalIncomeMarginal: number[] | null;
    takehomePay: number[] | null;
    taxableIncome: number[] | null;
  };
  
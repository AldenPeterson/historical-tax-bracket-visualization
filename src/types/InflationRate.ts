// The annual inflation rate for a given year, i.e. how much CPI-U grew
// from the prior year to this year (e.g. 0.026 means 2.6% inflation).
export type InflationRate = {
    year: number;
    inflationRate: number;
};

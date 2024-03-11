// Generate the inflation multipliers for the years 2024-1950
// To add additional year, append most recent inflation data
// and run the script again

const data = `1950	0.013
1951	0.079
1952	0.019
1953	0.008
1954	0.007
1955	-0.004
1956	0.015
1957	0.033
1958	0.028
1959	0.007
1960	0.017
1961	0.01
1962	0.01
1963	0.013
1964	0.013
1965	0.016
1966	0.029
1967	0.031
1968	0.042
1969	0.055
1970	0.057
1971	0.044
1972	0.032
1973	0.062
1974	0.11
1975	0.091
1976	0.058
1977	0.065
1978	0.076
1979	0.113
1980	0.135
1981	0.103
1982	0.062
1983	0.032
1984	0.043
1985	0.036
1986	0.019
1987	0.036
1988	0.041
1989	0.048
1990	0.054
1991	0.042
1992	0.03
1993	0.03
1994	0.026
1995	0.028
1996	0.03
1997	0.023
1998	0.016
1999	0.022
2000	0.034
2001	0.028
2002	0.016
2003	0.023
2004	0.027
2005	0.034
2006	0.032
2007	0.028
2008	0.038
2009	-0.004
2010	0.016
2011	0.032
2012	0.021
2013	0.015
2014	0.016
2015	0.001
2016	0.013
2017	0.021
2018	0.024
2019	0.018
2020	0.012
2021	0.047
2022	0.08
2023	0.041`;

const inflationData = data.split("\n").map((line) => {
  const [year, multiplier] = line.split("\t");
  return { year, multiplier };
});

let runningTotal = 1.0;
let jsonData = `{\n\t"${
  Number(inflationData[inflationData.length - 1].year) + 1
}": "1.000",\n`;
for (let i = inflationData.length - 1; i >= 0; i--) {
  const { year, multiplier } = inflationData[i];
  runningTotal /= 1 + parseFloat(multiplier);
  jsonData += `\t"${year}": "${runningTotal.toFixed(3)}"`;
  if (year !== "1950") {
    jsonData += `,`;
  }
  jsonData += `\n`;
}
jsonData += `}`;

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const fileName = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
  "inflation-multipliers.json"
);
fs.writeFileSync(fileName, jsonData);

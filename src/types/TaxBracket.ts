import { FilingStatus } from "./FilingStatus";

import { TaxType } from "./TaxType";

export interface TaxBracket {
        taxType: string;
        year: string;
        filingStatus: string;
        bracketMax: string;
        rate: string;
};

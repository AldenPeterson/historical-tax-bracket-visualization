
/*

  "2019": {
    "single": [
      { "bracketMax": 9700, "rate": 0.1 },
      { "bracketMax": 39475, "rate": 0.12 },
      { "bracketMax": 84200, "rate": 0.22 },
      { "bracketMax": 160725, "rate": 0.24 },
*/

const getTaxDataset = (income: number, filingStatus: string, brackets: any) => {

    let yearLabels: number[] = []
    let taxesOwed: number[]  = []
    for (let year in brackets){
        yearLabels.push(Number(year))

        if (!(filingStatus in brackets[year])){
            filingStatus = "default"
        }

        let yearTaxOwed = 0
        for (let index=0; index < brackets[year][filingStatus].length; index++){
            let priorBracketMax = 0
            const currentBracketMax = brackets[year][filingStatus][index].bracketMax
            const currentBracketRate = brackets[year][filingStatus][index].rate
            if (index > 0){
                priorBracketMax = brackets[year][filingStatus][index-1].bracketMax
            }
            if (currentBracketMax === "unlimited") {
                const bracketTaxOwed = (income - priorBracketMax) * currentBracketRate
                yearTaxOwed +=  bracketTaxOwed
            }
            else if (income <= currentBracketMax) {
                const incrementalTax = (income -  priorBracketMax) * currentBracketRate
                // console.log(`Adding final incremental tax: ${incrementalTax} to year ${year} for filing status ${filingStatus} and income ${income} at index ${index}`)
                yearTaxOwed += incrementalTax
                break;

            } else {
                const bracketTaxOwed = (currentBracketMax - priorBracketMax) * currentBracketRate
                yearTaxOwed +=  bracketTaxOwed
            }
        }
        taxesOwed.push(yearTaxOwed)
    }


    return {labels: yearLabels, values: taxesOwed}


}

export default getTaxDataset
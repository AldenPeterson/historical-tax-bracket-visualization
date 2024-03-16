
    import React from 'react';
    import '../index.css';

    const FAQ: React.FC = () => {
        return (
                <div style={{ textAlign: "left" }}>
                    <h1>Frequently Asked Questions</h1>
                    <h2>Why did you make this?</h2>
                    <p>I wanted a way to visualize the differences of historical tax code over time and the impact on 
                        different taxable income levels. This is challenging due to inflation, does $2000 in 1970 mean anything?
                        No, you need to convert from current dollars to 1970 dollars, evaluate based on 1970 tax code, 
                        and then convert back to current dollars. This tool does that for you.
                        <br></br><br></br>
                        This comes up frequently when debating traditional vs Roth for retirement contributions.
                    </p>
                    <h2>Is this guaranteed to be correct?</h2>
                    <p>No, this is a best effort attempt to model historical tax code. It's possible I've made mistakes, please  
                         <a href="https://github.com/AldenPeterson/historical-tax-bracket-visualization/issues/new"> open an issue</a> if you find mistakes.
                    </p>
                    <h2>Why can't you specify more than 2 personal exemptions?</h2>
                    <p>Treatment of dependents has changed somewhat significantly over time. If you have children, there are many
                        different tax situations which would have applied over the years. For simplicity sake, those are not modeled.
                    </p>
                    <h2>Why is the data only from 1950 onwards?</h2>
                    <p>Before 1950, the tax code was quite different and greatly influenced by WWII and the Great Depression. 
                        I may add this in the future however I do not believe it has a lot of value.</p>
                    <h2>Why are state taxes not included?</h2>
                    <p>The interaction between state/federal taxes has also changed meaningfully over time. For example, in recent years SALT cap changes 
                        and impact the usefulness of including state taxes - the goal is not to reproduce FreeTaxUSA for every year.
                        <br></br><br></br>
                        Additionally, assembling  tax data for a meaningful number of states sounds extremely unpleasant. </p>
                        <h2>Do you plan to expand this?</h2>
                        <p>I'd like to make this more useful for FIRE/retirement savings. I expect this could be useful for projecting future cashflow
                            and tax burden in retirement based on exiting traditional assets, expected returns, and expected future cash flow (ie social security, pensions, etc).
                        </p>
                </div>
        );

};

export default FAQ;
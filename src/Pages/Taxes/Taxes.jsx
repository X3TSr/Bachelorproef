import React from 'react'
import style from './Taxes.module.css'

import useDataFunctions from '../../hooks/useDataFunctions'

import Card from '../../Components/Card/Card';
import Carousel from '../../Components/Carousel/Carousel';

const Taxes = () => {

    const {
        getGrossTaxableIncome,
        getProfessionalCosts,
        getSocialContribution,
        getNetTaxableIncome,
        getTaxFreeSum,
        getTaxToPay,
    } = useDataFunctions()

    return (
        <section className={`${style.sectionTaxes}`}>
            <h1>Taxes</h1>
            <p className={`${style.subtitle}`}>
                Here you'll find an overview of how much tax you'll be paying.
                Not only that, but you'll also see where your money is going,
                helping you better understand how your taxes are allocated.
                Additionally, you'll find tips and tricks that might help you
                reduce the amount of tax you owe. This tool doesn't take into
                account a{`\t`}
                <a className='text-link-secondary' target='blank' href="https://fin.belgium.be/nl/particulieren/belastingaangifte/persoonlijke-situatie-gezinssituatie/personen-ten-laste/andere#bedragen-van-de-verhoging-van-de-belastingvrije-som">
                    reduction by dependents.
                </a>
            </p>
            <div className={`${style.taxCardContainer}`}>
                <Card theme='light' type='budgetText' content='Gross Taxable Income' number={getGrossTaxableIncome()} />
                <Card theme='light' type='budgetText' content='Professional Costs' number={getProfessionalCosts()} />
                <Card theme='light' type='budgetText' content='Social Contribution' number={getSocialContribution()} />
                <Card theme='light' type='budgetText' content='Net Taxable Income' number={getNetTaxableIncome()} />
                <Card theme='light' type='budgetTextG' content='Tax-free Sum' number={getTaxFreeSum()} />
                <Card theme='light' type='budgetTextR' content='Taxes To Pay' number={getTaxToPay()} />
            </div>
            <div className={`${style.tipCardContainer}`}>
                <Carousel>
                    <Card type='text' title='Deduct Professional Expenses' content={`
                        As a self-employed person, you can deduct expenses related to your professional activities from your income. This lowers your taxable profit—and therefore your taxes.
                        Examples:
                        • Laptop, phone, printer → Deductible if (partially) used for work.
                        • Internet and phone → e.g., 50% deductible if used privately as well.
                        • Software and subscriptions → Think of tools like Figma, Visual Studio Code, Dropbox, Notion, etc.
                        Tip: 
                        Always keep invoices or receipts (digital or paper). In case of an audit, you must be able to prove the expenses are work-related.
                    `} />
                    <Card type='text' title="Use Flat-Rate Expense Deduction (If It's More Beneficial)" content={`
                        Instead of deducting actual expenses, you can opt for a standard flat-rate deduction:
                        • 30% of your income is automatically considered a business expense.
                        • A maximum ceiling applies.
                        • No need to keep receipts or invoices.
                        ✅ Ideal if you have few expenses or want less administrative work.
                        ❌ Not suitable if you have many deductible costs.
                    `} />
                    <Card type='text' title='Use Your Car Smartly' content={`
                    If you use a car for professional purposes, related expenses are deductible:
                    • Fuel, insurance, maintenance, inspection, car wash, depreciation.
                    • Deduction % depends on CO₂ emissions:
                    ○ Electric car → often 100% deductible
                    ○ Petrol/Diesel → 50%-80% depending on emissions
                    📝 Keep a logbook to record private vs. professional kilometers.
                    `} />
                    <Card type='text' title='Pension Savings & VAPZ' content={`
                    You can save for your retirement in a tax-efficient way:
                    VAPZ (Voluntary Pension for the Self-Employed):
                    • Annual contributions (e.g. €3,000)
                    • Fully deductible as a professional expense
                    • Reduces both your taxes and social contributions
                    Pension savings (non-VAPZ):
                    • Up to ~€1,020 tax benefit per year
                    • Not a business expense, but a personal tax reduction                    
                    ✅ Combine both to save taxes and build your financial future.
                    `} />
                    <Card type='text' title='Invest at the End of the Year' content={`
                    Seeing high profits near year-end? Consider making investments before 31/12:
                    • New laptop, office chair, software licenses, training, etc.
                    • These reduce your profit for the current year
                    • Which means lower taxes and social contributions                    
                    ✅ Smart timing = money saved.
                    `} />
                    <Card type='text' title='Working from home regularly?' content={`
                    Then you can deduct part of your housing expenses:
                    • Determine what % of your home is used professionally (e.g., office = 10% of floor area)
                    • Deduct that % of rent, electricity, heating, water, and internet as business expenses                    
                    💡 You can also deduct furniture for your workspace (desk, chair, cabinet, etc.).
                    `} />
                    <Card type='text' title='Work with a good accountant' content={`
                    A good accountant is an investment, not an expense:
                    • Helps you find tax optimization strategies
                    • Knows what you can and cannot deduct
                    • Stays up to date with tax laws
                    • Prevents fines from mistakes or omissions                    
                    ✅ Tip: Choose someone experienced with freelancers or business starters.
                    `} />
                </Carousel>
            </div>
        </section>
    );
};

export default Taxes;
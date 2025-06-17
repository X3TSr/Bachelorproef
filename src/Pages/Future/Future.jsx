import React, { useEffect, useRef, useState } from 'react'
import style from './Future.module.css'

import * as modules from '../../general-js/scripts';

import Card from '../../Components/Card/Card';
import useDataFunctions from '../../hooks/useDataFunctions';
import { useIsMobile } from '../../hooks/useIsMobile';

const Future = () => {

    const [sliderIncomeValue, setSliderIncomeValue] = useState(0);
    const [sliderExpensesValue, setSliderExpensesValue] = useState(0);

    const {
        getCurrentDate,
        getMonthNet,
        getMonthTotalIncome,
        getMonthTotalExpenses,
    } = useDataFunctions();

    const isMobile = useIsMobile();

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const nextMonth = (parseInt(getCurrentDate().month) + 1).toString().padStart(2, '0') + getCurrentDate().year;
    const formatedMonth = nextMonth.slice(0, 2)[0].replace('0', '') + nextMonth.slice(0, 2)[1];
    const nextMonthName = months[formatedMonth];

    // Projection
    const monthLookBack = 6;
    let baselineAvgMonthIncome = 0;
    let baselineAvgMonthExpenses = 0;
    for (let i = 0; i < monthLookBack; i++) {
        const month = (parseInt(getCurrentDate().month) - i).toString().padStart(2, '0') + getCurrentDate().year;
        baselineAvgMonthIncome += parseFloat(getMonthTotalIncome(month));
        baselineAvgMonthExpenses += parseFloat(getMonthTotalExpenses(month));
    }
    baselineAvgMonthIncome /= monthLookBack;
    baselineAvgMonthExpenses /= monthLookBack;

    const projectedMonthIncome = baselineAvgMonthIncome * (1 + (sliderIncomeValue / 100));
    const projectedMonthExpenses = baselineAvgMonthExpenses * (1 + (sliderExpensesValue / 100));


    // Health card data
    const getHealthScore = (totalIncome, totalExpenses) => {
        if (totalIncome == 0 && totalExpenses == 0) return 0
        if (totalIncome == 0 && totalExpenses > 0) return -2

        const profitMargin = (totalIncome - totalExpenses) / totalIncome * 100;
        if (profitMargin > 30) return 2
        if (profitMargin > 15) return 1
        if (profitMargin > 5) return 0
        if (profitMargin > -5) return -1
        if (profitMargin > -25) return -2

        return -3
    }

    const getHealthLabel = (healthScore) => {
        if (healthScore == 2) return 'Exellent'
        if (healthScore == 1) return 'Good'
        if (healthScore == 0) return 'Neutral'
        if (healthScore == -1) return 'Warning'
        if (healthScore == -2) return 'Bad'
        if (healthScore == -3) return 'Very Bad'
    }

    return (
        <section className={`${style.sectionFuture}`}>
            <h1 style={{ textAlign: 'center' }} className='w100'>Future</h1>
            <h3 style={{ marginBottom: '3rem', textAlign: 'center' }}>Here is your projection for <span className='colorPrimary'>{nextMonthName}</span></h3>
            <div className={`${style.futureGrid}`}>
                <div className={`${style.sliders}`}>
                    <Card type='sliderProjection' title={`Incomes ${sliderIncomeValue}%`} content={sliderIncomeValue} onchange={setSliderIncomeValue} />
                    <Card type='sliderProjection' title={`Expenses ${sliderExpensesValue}%`} content={sliderExpensesValue} onchange={setSliderExpensesValue} />
                </div>

                <div className={`${style.wrapper}`}>
                    <div className={`flex justifySpaceBetween`}>
                        <Card classN='flex alignCenter justifyBottom' type='budgetTextG' content='Income' number={projectedMonthIncome.toFixed(2)} />
                        <Card classN='flex alignCenter justifyBottom' type='budgetTextR' content='Expenses' number={projectedMonthExpenses.toFixed(2)} />
                    </div>
                </div>

                <Card classN={`${style.healthMeter} ${isMobile ? '' : 'span2'}`} type='healthMeter' content={getHealthLabel(getHealthScore(projectedMonthIncome, projectedMonthExpenses))} score={getHealthScore(projectedMonthIncome, projectedMonthExpenses)} />

            </div>
        </section>
    );
};

export default Future;
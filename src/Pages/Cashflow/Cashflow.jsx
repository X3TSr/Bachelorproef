import React, { useState } from 'react'
import style from './Cashflow.module.css'

import * as modules from '../../general-js/scripts';

import Card from '../../Components/Card/Card';
import DailyNetChart from '../../Components/Graphs/DailyNetChart';
import useDataFunctions from '../../hooks/useDataFunctions';
import Transaction from '../../Components/Transaction/Transaction';
import Button from '../../Components/Button/Button';
import Overlay from '../../Components/Overlay/Overlay';
import AddEntry from '../../Components/AddEntry/AddEntry';
import AllTransactions from '../../Components/AllTransactions/AllTransactions';
import { useIsMobile } from '../../hooks/useIsMobile';

const Cashflow = () => {

    // Import data functions
    const {
        sortTransactionsByDate,
        getCurrentDate,
        getMonthNet,
        getMonthTotalIncome,
        getMonthTotalExpenses,
        getMonthAllTransactions
    } = useDataFunctions();

    const isMobile = useIsMobile();

    // Set useful variables to get month info
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const thisMonth = (getCurrentDate().month).toString().padStart(2, '0') + getCurrentDate().year;
    const formatedMonth = thisMonth.slice(0, 2)[0].replace('0', '') + thisMonth.slice(0, 2)[1];
    const thisMonthName = months[formatedMonth];

    // Set transaction variables
    const transactions = sortTransactionsByDate(getMonthAllTransactions());
    const lastTenTransactions = modules.arrayModule.copy(transactions).splice(isMobile ? -3 : -10).reverse();

    // Determin Health of business
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


    // Add cashflow handler
    const [showAddOverlay, setShowAddOverlay] = useState(false);
    const handleAddCashflow = () => {
        setShowAddOverlay(true);
    }
    const [showTransactionOverlay, setShowTransactionOverlay] = useState(false);
    const handleSeeAllTransactions = () => {
        setShowTransactionOverlay(true);
    }

    return (
        <>
            <section className={`${style.sectionCashflow}`}>
                {showAddOverlay && <Overlay overlayHandler={setShowAddOverlay}>
                    <AddEntry onComplete={() => setShowAddOverlay(false)} />
                </Overlay>}
                {showTransactionOverlay && <Overlay overlayHandler={setShowTransactionOverlay}>
                    <AllTransactions />
                </Overlay>}
                <h1 style={{ textAlign: 'center' }} className='w100'>Cashflow</h1>
                <h3 style={{ marginBottom: '3rem' }}>Here is your overview for <span className='colorPrimary'>{thisMonthName}</span></h3>
                <div className={`${style.cashFlowGrid} ${isMobile ? style.mobileCashflowGrid : ''}`}>
                    <div className={`${style.graphCard}`}>
                        <Card classN={`${style.graphCardMain}`} type='graphTop' content={`${thisMonthName} Net Result`} number={getMonthNet()}>
                            {getMonthAllTransactions() != 0 ? <DailyNetChart /> : <h2 className='flex jdc justifyMiddle alignCenter h100'>No transactions this month</h2>}
                        </Card>
                    </div>

                    <Card type='transactions' onclick={handleSeeAllTransactions} classN={`${style.mobileTransactions}`}>
                        {
                            lastTenTransactions.map((transaction, index) => {
                                return <Transaction key={index} transaction={transaction} />
                            })
                        }
                        {getMonthAllTransactions().length == 0 && <h2 className='flex jdc justifyMiddle alignCenter h100'>No transactions this month</h2>}
                    </Card>

                    <div className={`${style.wrapper}`}>
                        <Button text='Add Cashflow' fontSize='h4' onclick={handleAddCashflow} />
                        <div className={`flex justifySpaceBetween`}>
                            <Card type='budgetTextG' content='Income' number={getMonthTotalIncome()} />
                            <Card type='budgetTextR' content='Expenses' number={getMonthTotalExpenses()} />
                        </div>
                    </div>

                    <Card type='healthMeter' classN={`${style.mobileHealthBar}`} content={getHealthLabel(getHealthScore(getMonthTotalIncome(), getMonthTotalExpenses()))} score={getHealthScore(getMonthTotalIncome(), getMonthTotalExpenses())} />
                </div>
            </section>
        </>
    );
};

export default Cashflow;
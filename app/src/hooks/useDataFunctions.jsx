import * as modules from '../general-js/scripts'
import useFetchData from './useFetchData';


export default function useDataFunctions() {

    const date = new Date;
    const { data } = useFetchData();

    // ========================
    //          GENERAL
    // ========================
    const greaterThan = (a = 0, b = 0) => {
        return parseFloat(a) > parseFloat(b);
    }
    const getHighestValue = (a = 0, b = 0) => {
        const aVal = a.value ? a.value : a;
        const bVal = b.value ? b.value : b;
        return greaterThan(aVal, bVal) ? a : b
    }

    const smallerThan = (a = 0, b = 0) => {
        return parseFloat(a) < parseFloat(b);
    }
    const getLowestValue = (a = 0, b = 0) => {
        const aVal = a.value ? a.value : a;
        const bVal = b.value ? b.value : b;
        return smallerThan(aVal, bVal) ? a : b
    }

    const getTransactionDate = (transaction) => {
        const day = transaction.date.split('').splice(0, 2).join('');
        const month = transaction.date.split('').splice(2, 2).join('');
        const year = transaction.date.split('').splice(-4).join('');
        const date = { day, month, year };

        return date;
    }



    // ========================
    //          BY YEAR
    // ========================
    const getYearNet = () => {
        const lastYearGain = data.history.slice(-1)[0].gain;
        const lastYearLoss = data.history.slice(-1)[0].loss;

        return parseFloat(lastYearGain - (lastYearLoss * -1));
    }

    const getYearTotalIncome = (year = '') => {
        if (!data?.transactions) return 0;
        year = year ? year : date.getFullYear();

        let total = 0;
        data.transactions.map(transaction => {
            if (transaction.type != 'income') return;
            if (getTransactionDate(transaction).year != year) return;
            total += parseFloat(transaction.value);
        });

        return parseFloat(total).toFixed(2);
    }

    const getYearHighestIncome = (year = '') => {
        const date = new Date;
        year = year ? year : date.getFullYear();

        let highestIncome = data.transactions[0];
        data.transactions.map(transaction => {
            if (transaction.type != 'income') return;
            if (getTransactionDate(transaction).year != year) return;
            highestIncome = getHighestValue(transaction, highestIncome);
        });
        return highestIncome;
    }

    const getYearTotalExpenses = (year = '') => {
        if (!data?.transactions) return 0;
        year = year ? year : date.getFullYear();

        let total = 0;
        data.transactions.map(transaction => {
            if (transaction.type != 'expense') return;
            if (getTransactionDate(transaction).year != year) return;
            total += parseFloat(transaction.value);
        });

        return parseFloat(total).toFixed(2);
    }

    const getYearHighestExpense = (year = '') => {
        year = year ? year : date.getFullYear();

        let highestExpense = data.transactions[0];
        data.transactions.map(transaction => {
            if (transaction.type != 'expense') return;
            if (getTransactionDate(transaction).year != year) return;
            highestExpense = getHighestValue(transaction, highestExpense);
        });

        return highestExpense;
    }



    // ========================
    //          ALL TIME
    // ========================
    const getAllTimeTotalIncome = () => {
        let total = 0;
        data.transactions.map(transaction => {
            if (transaction.type != 'income') return;
            total += parseFloat(transaction.value);
        });

        return total.toFixed(2);
    }

    const getAllTimeHighestIncome = () => {
        let highestIncome = data.transactions[0];
        data.transactions.map(transaction => {
            if (transaction.type != 'income') return;
            highestIncome = getHighestValue(transaction, highestIncome);
        });

        return highestIncome;
    }

    const getAllTimeTotalExpenses = () => {
        let total = 0;
        data.transactions.map(transaction => {
            if (transaction.type != 'expense') return;
            total += parseFloat(transaction.value);
        });

        return total.toFixed(2);
    }

    const getAllTimeHighestExpense = () => {
        let highestExpense = data.transactions[0];
        data.transactions.map(transaction => {
            if (transaction.type != 'expense') return;
            highestExpense = getHighestValue(transaction, highestExpense);
        });

        return highestExpense;
    }

    const getAllTimeNet = () => {
        return parseFloat(
            parseFloat(getAllTimeTotalIncome()) - parseFloat(getAllTimeTotalExpenses())
        ).toFixed(2);
    }



    // ========================
    //          Taxes
    // ========================
    const brackets = {
        first: { limit: 15200, rate: .25 },
        second: { limit: 26830, rate: .4 },
        third: { limit: 46440, rate: .45 },
        fourth: { limit: Infinity, rate: .5 }
    }

    const getGrossTaxableIncome = () => {
        const grossTaxableIncome = getYearTotalIncome();
        return parseFloat(grossTaxableIncome).toFixed(2);
    }

    const getProfessionalCosts = () => {
        const professionalCosts = getYearTotalExpenses();
        return parseFloat(professionalCosts).toFixed(2);
    }

    const getSocialContribution = () => {
        const netTaxableIncomeBeforeSocial = getGrossTaxableIncome() - getProfessionalCosts()
        const socialContributionPercent = .205;
        const socialContribution = netTaxableIncomeBeforeSocial * socialContributionPercent;
        return parseFloat(socialContribution).toFixed(2);
    }

    const getNetTaxableIncome = () => {
        const netTaxableIncomeBeforeSocial = getGrossTaxableIncome() - getProfessionalCosts()
        const netTaxableIncome = netTaxableIncomeBeforeSocial - getSocialContribution()
        return parseFloat(netTaxableIncome).toFixed(2);
    }

    const getTaxFreeSum = () => {
        const taxFreeSum = 10570;
        return parseFloat(taxFreeSum * brackets.first.rate).toFixed(2);
    }

    const getTaxToPay = () => {
        let finalTaxableIncome = getNetTaxableIncome() - getTaxFreeSum();
        let taxToPay = 0;

        Array.from(brackets).forEach(bracket => {
            if (finalTaxableIncome <= 0) return
            finalTaxableIncome >= bracket.limit ?
                taxToPay += bracket.limit * bracket.rate :
                taxToPay += finalTaxableIncome * bracket.rate;
            finalTaxableIncome -= bracket.limit;
        });
        return parseFloat(taxToPay).toFixed(2);
    }



    // ========================
    //          EXPORT
    // ========================
    return {
        getTransactionDate,
        getYearNet,
        getYearTotalIncome,
        getYearHighestIncome,
        getYearTotalExpenses,
        getYearHighestExpense,

        getAllTimeTotalIncome,
        getAllTimeHighestIncome,
        getAllTimeTotalExpenses,
        getAllTimeHighestExpense,
        getAllTimeNet,

        getGrossTaxableIncome,
        getProfessionalCosts,
        getSocialContribution,
        getNetTaxableIncome,
        getTaxFreeSum,
        getTaxToPay,
    }
}
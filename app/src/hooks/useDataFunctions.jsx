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
    //          BY DAY
    // ========================
    const getDayTransactions = (dayMonthYearValue) => {
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return [];
        if (!dayMonthYearValue) {
            console.error('No date given');
            return [];
        }

        const transactions = [];
        data.transactions.map(transaction => {
            if (getTransactionDate(transaction).day != getTransactionDate(dayMonthYearValue).day) return;
            if (getTransactionDate(transaction).month != getTransactionDate(dayMonthYearValue).month) return;
            if (getTransactionDate(transaction).year != getTransactionDate(dayMonthYearValue).year) return;
            transactions.push(transaction);
        });

        return transactions;
    }



    // ========================
    //          BY MONTH
    // ========================
    const getMonthTransactions = (monthYearValue) => {
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return [];
        if (!monthYearValue) {
            console.error('No date given');
            return [];
        }

        const transactions = [];
        data.transactions.map(transaction => {
            if (getTransactionDate(transaction).month != monthYearValue.slice(0, 2)) return;
            if (getTransactionDate(transaction).year != monthYearValue.slice(-4)) return;
            transactions.push(transaction);
        });

        return transactions;
    }



    // ========================
    //          BY YEAR
    // ========================
    const getYearAllTransactions = (year = '') => {
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return [];
        const date = new Date;
        year = year ? year : date.getFullYear();

        let transactions = [];
        data.transactions.map((transaction) => {
            if (getTransactionDate(transaction).year != year) return;
            transactions.push(transaction);
        })

        return transactions;
    }

    const getYearTotalIncome = (year = '') => {
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return (0).toFixed(2);
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
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return { label: '', value: 0 };
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
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return (0).toFixed(2);
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
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return { label: '', value: 0 };
        year = year ? year : date.getFullYear();

        let highestExpense = data.transactions[0];
        data.transactions.map(transaction => {
            if (transaction.type != 'expense') return;
            if (getTransactionDate(transaction).year != year) return;
            highestExpense = getHighestValue(transaction, highestExpense);
        });

        return highestExpense;
    }

    const getYearNet = () => {
        return parseFloat(getYearTotalIncome() - getYearTotalExpenses());
    }



    // ========================
    //          ALL TIME
    // ========================
    const getAllTimeTotalIncome = () => {
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return (0).toFixed(2);
        let total = 0;
        data.transactions.map(transaction => {
            if (transaction.type != 'income') return;
            total += parseFloat(transaction.value);
        });

        return total.toFixed(2);
    }

    const getAllTimeHighestIncome = () => {
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return { label: '', value: 0 };
        let highestIncome = data.transactions[0];
        data.transactions.map(transaction => {
            if (transaction.type != 'income') return;
            highestIncome = getHighestValue(transaction, highestIncome);
        });

        return highestIncome;
    }

    const getAllTimeTotalExpenses = () => {
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return (0).toFixed(2);
        let total = 0;
        data.transactions.map(transaction => {
            if (transaction.type != 'expense') return;
            total += parseFloat(transaction.value);
        });

        return total.toFixed(2);
    }

    const getAllTimeHighestExpense = () => {
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return { label: '', value: 0 };
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

        getDayTransactions,

        getMonthTransactions,

        getYearAllTransactions,
        getYearTotalIncome,
        getYearHighestIncome,
        getYearTotalExpenses,
        getYearHighestExpense,
        getYearNet,

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
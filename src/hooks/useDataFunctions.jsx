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

    const sortTransactionsByDate = (transactions, order = 'asc') => {
        const factor = order === 'desc' ? -1 : 1;

        return transactions.slice().sort((a, b) => {
            const dateA = getTransactionDate(a);
            const dateB = getTransactionDate(b);

            if (dateA.year !== dateB.year) {
                return (dateA.year - dateB.year) * factor;
            }
            if (dateA.month !== dateB.month) {
                return (dateA.month - dateB.month) * factor;
            }
            return (dateA.day - dateB.day) * factor;
        });
    }

    const getTransactionDate = (transaction) => {
        const day = transaction.date.split('').splice(0, 2).join('');
        const month = transaction.date.split('').splice(2, 2).join('');
        const year = transaction.date.split('').splice(-4).join('');
        const dateObj = { day, month, year };

        return dateObj;
    }

    const getCurrentDate = () => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const full = day + month + year;
        const dateObj = { day, month, year, full };

        return dateObj;
    }



    // ========================
    //          BY DAY
    // ========================
    const getDayAllTransactions = (dayMonthYearValue = '') => {
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return [];
        dayMonthYearValue = dayMonthYearValue ? dayMonthYearValue : getCurrentDate().full;

        const transactions = [];
        data.transactions.map(transaction => {
            if (getTransactionDate(transaction).year != getTransactionDate(dayMonthYearValue).year) return;
            if (getTransactionDate(transaction).month != getTransactionDate(dayMonthYearValue).month) return;
            if (getTransactionDate(transaction).day != getTransactionDate(dayMonthYearValue).day) return;
            transactions.push(transaction);
        });

        return transactions;
    }


    // ========================
    //          BY MONTH
    // ========================
    const getMonthAllTransactions = (monthYearValue = '') => {
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return [];
        monthYearValue = monthYearValue ? monthYearValue : getCurrentDate().full.slice(2);

        const transactions = [];
        data.transactions.map(transaction => {
            if (getTransactionDate(transaction).year != monthYearValue.slice(-4)) return;
            if (getTransactionDate(transaction).month != monthYearValue.slice(0, 2)) return;
            transactions.push(transaction);
        });

        return transactions;
    }

    const getMonthTotalIncome = (monthYearValue = '') => {
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return (0).toFixed(2);
        monthYearValue = monthYearValue ? monthYearValue : getCurrentDate().full.slice(2);

        let total = 0;
        data.transactions.map(transaction => {
            if (transaction.type != 'income') return;
            if (getTransactionDate(transaction).year != monthYearValue.slice(-4)) return;
            if (getTransactionDate(transaction).month != monthYearValue.slice(0, 2)) return;
            total += parseFloat(transaction.value);
        });

        return parseFloat(total).toFixed(2);
    }

    const getMonthTotalExpenses = (monthYearValue = '') => {
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return (0).toFixed(2);
        monthYearValue = monthYearValue ? monthYearValue : getCurrentDate().full.slice(2);

        let total = 0;
        data.transactions.map(transaction => {
            if (transaction.type != 'expense') return;
            if (getTransactionDate(transaction).year != monthYearValue.slice(-4)) return;
            if (getTransactionDate(transaction).month != monthYearValue.slice(0, 2)) return;
            total += parseFloat(transaction.value);
        });

        return parseFloat(total).toFixed(2);
    }

    const getMonthNet = (monthYearValue = '') => {
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return [];
        monthYearValue = monthYearValue ? monthYearValue : getCurrentDate().full.slice(2);

        return parseFloat(getMonthTotalIncome(monthYearValue) - getMonthTotalExpenses(monthYearValue));
    }



    // ========================
    //          BY YEAR
    // ========================
    const getYearAllTransactions = (year = '') => {
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return [];
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
        return parseFloat(getYearTotalIncome() - getYearTotalExpenses()).toFixed(2);
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

    const getAllTimeTransactions = () => {
        if (!data || !Object.hasOwn(data, 'transactions') || data?.transactions.length == 0) return [{ label: '', value: 0 }];
        const transactions = data.transactions.slice();
        return transactions;
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
        Object.entries(brackets).forEach(bracket => {
            if (finalTaxableIncome <= 0) return
            finalTaxableIncome >= bracket[1].limit ?
                taxToPay += bracket[1].limit * bracket[1].rate :
                taxToPay += finalTaxableIncome * bracket[1].rate;
            finalTaxableIncome -= bracket[1].limit;
        });
        return parseFloat(taxToPay).toFixed(2);
    }



    // ========================
    //          EXPORT
    // ========================
    return {
        sortTransactionsByDate,
        getTransactionDate,
        getCurrentDate,

        getDayAllTransactions,

        getMonthAllTransactions,
        getMonthTotalIncome,
        getMonthTotalExpenses,
        getMonthNet,

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
        getAllTimeTransactions,

        getGrossTaxableIncome,
        getProfessionalCosts,
        getSocialContribution,
        getNetTaxableIncome,
        getTaxFreeSum,
        getTaxToPay,
    }
}
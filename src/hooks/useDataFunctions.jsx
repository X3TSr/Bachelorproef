import * as modules from '../general-js/scripts'
import useFetchData from './useFetchData';
import { useMemo } from 'react';


export default function useDataFunctions() {

    const date = new Date;
    const { data } = useFetchData();

    // Memoize parsed transactions to avoid repeated parsing for every calculation
    const transactions = useMemo(() => {
        if (!data?.transactions?.length) return [];
        return data.transactions.map(t => {
            const day = t.date?.slice(0, 2) ?? '';
            const month = t.date?.slice(2, 4) ?? '';
            const year = t.date?.slice(-4) ?? '';
            const parsedDate = { day, month, year };
            const valueNum = parseFloat(t.value || 0);
            return { ...t, parsedDate, valueNum, absValue: Math.abs(valueNum) };
        });
    }, [data]);

    // Helper to get parsed date in the same shape as getTransactionDate
    const getParsedDate = (transaction) => transaction.parsedDate || getTransactionDate(transaction);

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
            const dateA = getParsedDate(a);
            const dateB = getParsedDate(b);

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
        const day = transaction.date?.split('').splice(0, 2).join('');
        const month = transaction.date?.split('').splice(2, 2).join('');
        const year = transaction.date?.split('').splice(-4).join('');
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
        if (!transactions.length) return [];
        dayMonthYearValue = dayMonthYearValue ? dayMonthYearValue : getCurrentDate().full;
        const day = dayMonthYearValue.slice(0, 2);
        const month = dayMonthYearValue.slice(2, 4);
        const year = dayMonthYearValue.slice(-4);

        return transactions.filter(t => {
            const d = t.parsedDate;
            return d.year === year && d.month === month && d.day === day;
        });
    }


    // ========================
    //          BY MONTH
    // ========================
    const getMonthAllTransactions = (monthYearValue = '') => {
        if (!transactions.length) return [];
        monthYearValue = monthYearValue ? monthYearValue : getCurrentDate().full.slice(2);
        const month = monthYearValue.slice(0, 2);
        const year = monthYearValue.slice(-4);

        return transactions.filter(t => t.parsedDate.year === year && t.parsedDate.month === month);
    }

    const getMonthTotalIncome = (monthYearValue = '') => {
        if (!transactions.length) return (0).toFixed(2);
        monthYearValue = monthYearValue ? monthYearValue : getCurrentDate().full.slice(2);
        const month = monthYearValue.slice(0, 2);
        const year = monthYearValue.slice(-4);

        const total = transactions.reduce((acc, t) => {
            if (t.type !== 'income') return acc;
            if (t.parsedDate.year !== year || t.parsedDate.month !== month) return acc;
            return acc + (t.valueNum ?? parseFloat(t.value || 0));
        }, 0);

        return parseFloat(total).toFixed(2);
    }

    const getMonthTotalExpenses = (monthYearValue = '') => {
        if (!transactions.length) return (0).toFixed(2);
        monthYearValue = monthYearValue ? monthYearValue : getCurrentDate().full.slice(2);
        const month = monthYearValue.slice(0, 2);
        const year = monthYearValue.slice(-4);

        const total = transactions.reduce((acc, t) => {
            if (t.type !== 'expense') return acc;
            if (t.parsedDate.year !== year || t.parsedDate.month !== month) return acc;
            return acc + (t.valueNum ?? parseFloat(t.value || 0));
        }, 0);

        return parseFloat(total).toFixed(2);
    }

    const getMonthNet = (monthYearValue = '') => {
        return parseFloat(getMonthTotalIncome(monthYearValue) - getMonthTotalExpenses(monthYearValue));
    }




    // ========================
    //          BY YEAR
    // ========================
    const getYearAllTransactions = (year = '') => {
        if (!transactions.length) return [];
        year = year ? year : date.getFullYear();
        return transactions.filter(t => t.parsedDate.year == year);
    }

    const getYearTotalIncome = (year = '') => {
        if (!transactions.length) return (0).toFixed(2);
        year = year ? year : date.getFullYear();
        const total = transactions.reduce((acc, t) => {
            if (t.type !== 'income') return acc;
            if (t.parsedDate.year != year) return acc;
            return acc + (t.valueNum ?? parseFloat(t.value || 0));
        }, 0);
        return parseFloat(total).toFixed(2);
    }

    const getYearHighestIncome = (year = '') => {
        if (!transactions.length) return { label: '', value: 0 };
        year = year ? year : date.getFullYear();
        const incomes = transactions.filter(t => t.type === 'income' && t.parsedDate.year == year);
        if (!incomes.length) return { label: '', value: 0 };
        return incomes.reduce((best, cur) => getHighestValue(cur, best), incomes[0]);
    }

    const getYearTotalExpenses = (year = '') => {
        if (!transactions.length) return (0).toFixed(2);
        year = year ? year : date.getFullYear();
        const total = transactions.reduce((acc, t) => {
            if (t.type !== 'expense') return acc;
            if (t.parsedDate.year != year) return acc;
            return acc + (t.valueNum ?? parseFloat(t.value || 0));
        }, 0);
        return parseFloat(total).toFixed(2);
    }

    const getYearHighestExpense = (year = '') => {
        if (!transactions.length) return { label: '', value: 0 };
        year = year ? year : date.getFullYear();
        const expenses = transactions.filter(t => t.type === 'expense' && t.parsedDate.year == year);
        if (!expenses.length) return { label: '', value: 0 };
        return expenses.reduce((best, cur) => getHighestValue(cur, best), expenses[0]);
    }

    const getYearNet = () => parseFloat(getYearTotalIncome() - getYearTotalExpenses()).toFixed(2);



    // ========================
    //          BY TAG
    // ========================
    const getValue = (transaction, useAbsolute) => useAbsolute ? (transaction.absValue ?? Math.abs(parseFloat(transaction.value))) : (transaction.valueNum ?? parseFloat(transaction.value));

    // Percent by tag (all time)
    const getPercentByTagAllTime = (tag, useAbsolute = true) => {
        if (!transactions.length) return (0).toFixed(2);

        const totals = transactions.reduce((acc, t) => {
            const v = getValue(t, useAbsolute);
            if (t.tag == tag) acc.tagTotal += v;
            acc.total += v;
            return acc;
        }, { tagTotal: 0, total: 0 });

        if (totals.total === 0) return (0).toFixed(2);
        return ((totals.tagTotal / totals.total) * 100).toFixed(2);
    };
    const getTransactionPercentByTagAllTime = (tag, transaction, useAbsolute = true) => {
        if (!transactions.length) return (0).toFixed(2);

        const tagTotal = transactions.reduce((acc, t) => t.tag == tag ? acc + getValue(t, useAbsolute) : acc, 0);
        const transValue = getValue(transaction, useAbsolute);
        if (tagTotal == 0) return (0).toFixed(2);
        return ((transValue / tagTotal) * 100).toFixed(2);
    };


    // Percent by tag this year
    const getPercentByTagYear = (tag, year = getCurrentDate().year, useAbsolute = true) => {
        if (!transactions.length) return (0).toFixed(2);
        const totals = transactions.reduce((acc, t) => {
            if (t.parsedDate.year != year) return acc;
            const v = getValue(t, useAbsolute);
            if (t.tag == tag) acc.tagTotal += v;
            acc.total += v;
            return acc;
        }, { tagTotal: 0, total: 0 });
        if (totals.total === 0) return (0).toFixed(2);
        return ((totals.tagTotal / totals.total) * 100).toFixed(2);
    };
    const getTransactionPercentByTagYear = (tag, transaction, year = getCurrentDate().year, useAbsolute = true) => {
        if (!transactions.length) return (0).toFixed(2);
        const tagTotal = transactions.reduce((acc, t) => (t.tag == tag && t.parsedDate.year == year) ? acc + getValue(t, useAbsolute) : acc, 0);
        const transValue = getValue(transaction, useAbsolute);
        if (tagTotal == 0) return (0).toFixed(2);
        return ((transValue / tagTotal) * 100).toFixed(2);
    };


    // Percent by tag this month
    const getPercentByTagMonth = (tag, monthYearValue = getCurrentDate().full.slice(2), useAbsolute = true) => {
        if (!transactions.length) return (0).toFixed(2);
        const month = monthYearValue.slice(0, 2);
        const year = monthYearValue.slice(-4);
        const totals = transactions.reduce((acc, t) => {
            if (t.parsedDate.year !== year || t.parsedDate.month !== month) return acc;
            const v = getValue(t, useAbsolute);
            if (t.tag == tag) acc.tagTotal += v;
            acc.total += v;
            return acc;
        }, { tagTotal: 0, total: 0 });
        if (totals.total === 0) return (0).toFixed(2);
        return ((totals.tagTotal / totals.total) * 100).toFixed(2);
    };
    const getTransactionPercentByTagMonth = (tag, transaction, monthYearValue = getCurrentDate().full.slice(2), useAbsolute = true) => {
        if (!transactions.length) return (0).toFixed(2);
        const month = monthYearValue.slice(0, 2);
        const year = monthYearValue.slice(-4);
        const tagTotal = transactions.reduce((acc, t) => (t.tag == tag && t.parsedDate.year == year && t.parsedDate.month == month) ? acc + getValue(t, useAbsolute) : acc, 0);
        const transValue = getValue(transaction, useAbsolute);
        if (tagTotal == 0) return (0).toFixed(2);
        return ((transValue / tagTotal) * 100).toFixed(2);
    };


    // Percent by tag this day
    const getPercentByTagDay = (tag, dayMonthYearValue = getCurrentDate().full, useAbsolute = true) => {
        if (!transactions.length) return (0).toFixed(2);
        const day = dayMonthYearValue.slice(0, 2);
        const month = dayMonthYearValue.slice(2, 4);
        const year = dayMonthYearValue.slice(-4);
        const totals = transactions.reduce((acc, t) => {
            if (t.parsedDate.year !== year || t.parsedDate.month !== month || t.parsedDate.day !== day) return acc;
            const v = getValue(t, useAbsolute);
            if (t.tag == tag) acc.tagTotal += v;
            acc.total += v;
            return acc;
        }, { tagTotal: 0, total: 0 });
        if (totals.total === 0) return (0).toFixed(2);
        return ((totals.tagTotal / totals.total) * 100).toFixed(2);
    };
    const getTransactionPercentByTagDay = (tag, transaction, dayMonthYearValue = getCurrentDate().full, useAbsolute = true) => {
        if (!transactions.length) return (0).toFixed(2);
        const day = dayMonthYearValue.slice(0, 2);
        const month = dayMonthYearValue.slice(2, 4);
        const year = dayMonthYearValue.slice(-4);
        const tagTotal = transactions.reduce((acc, t) => (t.tag == tag && t.parsedDate.year == year && t.parsedDate.month == month && t.parsedDate.day == day) ? acc + getValue(t, useAbsolute) : acc, 0);
        const transValue = getValue(transaction, useAbsolute);
        if (tagTotal == 0) return (0).toFixed(2);
        return ((transValue / tagTotal) * 100).toFixed(2);
    };



    // ========================
    //          ALL TIME
    // ========================
    const getAllTimeTotalIncome = () => {
        if (!transactions.length) return (0).toFixed(2);
        const total = transactions.reduce((acc, t) => t.type === 'income' ? acc + (t.valueNum ?? parseFloat(t.value || 0)) : acc, 0);
        return total.toFixed(2);
    }

    const getAllTimeHighestIncome = () => {
        if (!transactions.length) return { label: '', value: 0 };
        const incomes = transactions.filter(t => t.type === 'income');
        if (!incomes.length) return { label: '', value: 0 };
        return incomes.reduce((best, cur) => getHighestValue(cur, best), incomes[0]);
    }

    const getAllTimeTotalExpenses = () => {
        if (!transactions.length) return (0).toFixed(2);
        const total = transactions.reduce((acc, t) => t.type === 'expense' ? acc + (t.valueNum ?? parseFloat(t.value || 0)) : acc, 0);
        return total.toFixed(2);
    }

    const getAllTimeHighestExpense = () => {
        if (!transactions.length) return { label: '', value: 0 };
        const expenses = transactions.filter(t => t.type === 'expense');
        if (!expenses.length) return { label: '', value: 0 };
        return expenses.reduce((best, cur) => getHighestValue(cur, best), expenses[0]);
    }

    const getAllTimeNet = () => parseFloat(parseFloat(getAllTimeTotalIncome()) - parseFloat(getAllTimeTotalExpenses())).toFixed(2);

    const getAllTimeTransactions = () => {
        if (!transactions.length) return [];
        return transactions.slice();
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

        getPercentByTagAllTime,
        getTransactionPercentByTagAllTime,
        getPercentByTagYear,
        getTransactionPercentByTagYear,
        getPercentByTagMonth,
        getTransactionPercentByTagMonth,
        getPercentByTagDay,
        getTransactionPercentByTagDay,

        getGrossTaxableIncome,
        getProfessionalCosts,
        getSocialContribution,
        getNetTaxableIncome,
        getTaxFreeSum,
        getTaxToPay,
    }
}
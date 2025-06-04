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
        year = year ? year : date.getFullYear();
        console.log(year);

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
    //          EXPORT
    // ========================
    return {
        getTransactionDate,
        getYearNet,
        getYearTotalIncome,
        getYearHighestIncome,
        getYearHighestExpense,
        getAllTimeTotalIncome,
        getAllTimeHighestIncome,
        getAllTimeTotalExpenses,
        getAllTimeHighestExpense,
        getAllTimeNet
    }
}
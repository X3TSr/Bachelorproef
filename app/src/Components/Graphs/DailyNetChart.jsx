import React from 'react'

import { ResponsiveBar } from '@nivo/bar';
import useDataFunctions from '../../hooks/useDataFunctions';

const DailyNetChart = () => {

    const {
        getCurrentDate,
        getTransactionDate,
        getMonthAllTransactions
    } = useDataFunctions();

    // Helper function to get the green and red used by the app
    // This returns depending on if the value is positive or negative
    const getColor = (bar) => {
        const green = getComputedStyle(document.getElementById('root')).getPropertyValue('--color-green');
        const red = getComputedStyle(document.getElementById('root')).getPropertyValue('--color-red');

        return bar.data.isNegative ? red : green;
    };

    // Get the transactions of the last month
    const lastMonth = (getCurrentDate().month - 1).toString().padStart(2, '0') + getCurrentDate().year;
    const monthTransactions = getMonthAllTransactions(lastMonth);

    const dailyData = {};
    // Group in an array the transactions on each day in the given month
    monthTransactions.map((transaction) => {
        const transactionDay = getTransactionDate(transaction).day;
        const convertedTransactionDay = transactionDay[0] == 0 ? transactionDay.replace('0', '') : transactionDay;
        if (Object.keys(dailyData).length == 0) dailyData[convertedTransactionDay] = [];
        if (!Object.hasOwn(dailyData, convertedTransactionDay)) dailyData[convertedTransactionDay] = [];
        dailyData[convertedTransactionDay].push(transaction);
    });
    // Fill in the days with no transactions
    for (let i = 1; i <= 30; i++) {
        if (!Object.hasOwn(dailyData, i)) dailyData[i] = [];
    }

    // Calculate the net values on each day
    const netData = Object.entries(dailyData).map((day) => {
        let net = 0;
        day[1].map((transaction) => {
            if (transaction.type == 'income') net += parseFloat(transaction.value);
            if (transaction.type == 'expense') net -= parseFloat(transaction.value);
        });

        return {
            day: `${day[0]}`,
            net: Number(Math.abs(parseFloat(net).toFixed(2))),
            isNegative: parseFloat(net).toFixed(2) < 0
        }
    });

    return (
        <ResponsiveBar
            data={netData}
            keys={['net']}
            indexBy="day"

            colors={getColor}
            borderRadius={3}
            padding={0.4}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            animate={true}
            motionConfig="stiff"

            layout="vertical"
            enableLabel={false}

            tooltip={({ data, color, value }) => (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        background: 'var(--color-secondary)',
                        color: '#fff',
                        border: `2px solid ${color}`,
                        borderRadius: '4px',
                        boxShadow: '0 0 1rem #000F',
                        width: '14rem',
                        padding: '6px 9px',
                    }}
                >
                    <p style={{ textAlign: 'center' }}>Day {data.day}<br /><strong style={{ color }}>{data.isNegative ? 'Loss' : 'Income'}:</strong> {value} €</p>
                </div>
            )}
            theme={{}}

            gridYValues={[]}
            axisLeft={null}
            axisBottom={null}
        />
    );
};

export default DailyNetChart;
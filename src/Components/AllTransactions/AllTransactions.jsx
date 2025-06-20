import React, { useMemo, useState } from 'react';
import style from './AllTransactions.module.css';

import useDataFunctions from '../../hooks/useDataFunctions';

import Card from '../Card/Card';
import Transaction from '../Transaction/Transaction';
import Input from '../Input/Input';
import Select from '../Select/Select';
import TransactionDetail from '../Transaction/detail/TransactionDetail';

const AllTransactions = () => {
    const {
        getAllTimeTransactions,
        getAllTimeNet
    } = useDataFunctions();

    const allTransactions = getAllTimeTransactions();

    const [hideAll, setHideAll] = useState(false);
    const [showDetail, setShowDetail] = useState(null);

    const [searchValue, setSearchValue] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortDirection, setSortDirection] = useState('descending');

    const reformatDate = (unformatedDate) => {
        const day = parseInt(unformatedDate.slice(0, 2));
        const month = parseInt(unformatedDate.slice(2, 4)) - 1;
        const year = parseInt(unformatedDate.slice(-4));
        const d = new Date(year, month, day);
        return d;
    }

    const filteredTransactions = useMemo(() => {
        let filtered = allTransactions?.filter((t) =>
            t.label?.toLowerCase().includes(searchValue.toLowerCase())
        ) || [];

        // Sorting logic
        filtered.sort((a, b) => {
            let aValue, bValue;

            if (sortBy == 'price') {
                aValue = a.type == 'income' ? parseFloat(a.value) : parseFloat(`-${a.value}`);
                bValue = b.type == 'income' ? parseFloat(b.value) : parseFloat(`-${b.value}`);
            } else {
                // Default: sort by date (assuming descending is newest first)
                aValue = reformatDate(a.date) || 0;
                bValue = reformatDate(b.date) || 0;
            }

            if (aValue < bValue) return sortDirection.toLowerCase() == 'ascending' ? -1 : 1;
            if (aValue > bValue) return sortDirection.toLowerCase() == 'ascending' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [allTransactions, searchValue, sortBy, sortDirection]);

    return (
        <section className={`${style.sectionAllTransactions}`}>
            <h1>All Transactions</h1>
            <h4 style={{ opacity: '.6', marginBottom: '4rem' }}>Total: € {getAllTimeNet()}</h4>

            <div className='flex alignCenter' style={{ gap: '1rem', marginBottom: '1rem' }} >
                <Select options={['Date', 'Price']} onchange={setSortBy} />
                <Select options={['Descending', 'Ascending']} onchange={setSortDirection} />
            </div>

            <span style={{ marginBottom: '1rem' }}>
                <Input htmlFor='search' content={searchValue} onchange={setSearchValue} />
            </span>

            <div className={`${style.transactionsContainer}`}>
                {!hideAll &&
                    <div className={`${style.scrollBox}`}>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction, index) => (
                                <Transaction key={index} transaction={transaction} hasDate onclick={() => { setHideAll(true); setShowDetail(transaction) }} />
                            ))
                        ) : (
                            <h2 className='flex jdc justifyMiddle alignCenter h100'>
                                No transactions match your search
                            </h2>
                        )}
                    </div>
                }
                {showDetail &&
                    <TransactionDetail transaction={showDetail} backFn={() => { setHideAll(false); setShowDetail(null) }} />
                }
            </div>

            <Card classN={`${style.containerBackground}`} />
        </section>
    );
};

export default AllTransactions;

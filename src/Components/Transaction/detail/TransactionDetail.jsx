import React, { useState } from 'react'
import style from './TransactionDetail.module.css';

import * as modules from '../../../general-js/scripts';
import useDataFunctions from '../../../hooks/useDataFunctions';
import useFetchData from '../../../hooks/useFetchData';
import { dbUpdateTransaction, dbDeleteTransaction } from '../../../firebase/firebase';

import Button from '../../Button/Button';

const TAG_OPTIONS = [
    'Food',
    'Marketing',
    'Social Contribution',
    'Taxes',
    'Travel',
    'Water & Electricity',
    'Transport',
    'Shopping',
    'Bills',
    'Health',
    'Entertainment'
];

const TransactionDetail = ({
    transaction,
    backFn = () => { },
}) => {

    const {
        getTransactionDate,
        getTransactionPercentByTagAllTime,
        getTransactionPercentByTagYear,
        getTransactionPercentByTagMonth,
        getTransactionPercentByTagDay
    } = useDataFunctions();

    const { data, refetch } = useFetchData();

    const [editingTag, setEditingTag] = useState(false);
    const [selectedTag, setSelectedTag] = useState('');

    const handleImageError = (e) => {
        e.target.src = '/tags/unknown.svg';
    };

    const tagSize = '4rem'
    const getTag = () => {
        const tag = (transaction.tag ?? 'unknown').toLowerCase()
        return (
            <div style={{
                width: `${tagSize}`,
                height: `${tagSize}`,
                backgroundColor: 'var(--color-white)',
                borderRadius: '50vw'
            }} className={`flex justifyMiddle alignCenter`}>
                {transaction.tag && <img style={{ width: `calc(${tagSize}/2)` }} src={`/tags/${modules.textCasingModule.toKebabCase(tag)}.svg`} alt={`${modules.textCasingModule.toKebabCase(tag)}-tag`} onError={handleImageError} />}
            </div>
        )
    }

    const onTagChange = async (newTag) => {
        if (!data) return;

        // Prefer updating by uid when available
        if (transaction.uid) {
            await dbUpdateTransaction({ ...transaction, tag: newTag });
            return;
        }

        for (let t of data.transactions) {
            if (t.label === transaction.label &&
                t.type === transaction.type &&
                t.value === transaction.value &&
                t.date === transaction.date) {
                await dbUpdateTransaction({
                    ...t,
                    tag: newTag
                });
            }
        }
    };

    const handleTagChange = (e) => {
        setSelectedTag(e.target.value);
    };

    const handleTagSave = async () => {
        if (selectedTag) {
            await onTagChange(selectedTag);
            transaction.tag = selectedTag;
            await refetch();
            setEditingTag(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.');
        if (!confirmed) return;
        try {
            await dbDeleteTransaction(transaction);
            await refetch();
            backFn();
        } catch (e) {
            console.error('Failed to delete transaction', e);
        }
    };

    return (
        <div className={`${style.container}`}>
            <span className={`${style.backArrow}`} onClick={() => backFn()}>←</span>
            <div className='flex justifySpaceBetween'>
                <h2>{transaction.label || 'Unknown Transaction'}</h2>
                <h2>{getTransactionDate(transaction).day}/{getTransactionDate(transaction).month}/{getTransactionDate(transaction).year}</h2>
            </div>
            <h4 style={{ opacity: '.6' }}>Amount: € {transaction.type == 'income' ? transaction.value : `-${transaction.value}`}</h4>
            <div className={`${style.tag}`} style={{ marginTop: '4rem' }}>
                {getTag()}
                <h4>
                    Tag: {transaction.tag ? transaction.tag : 'Unknown'}
                </h4>
                {!transaction.tag &&
                    (!editingTag ? (
                        <Button onclick={() => setEditingTag(true)} text='Change Tag' width='25%'>
                            Change Tag
                        </Button>
                    ) : (
                        <div style={{ width: '70%', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <select value={selectedTag} onChange={handleTagChange}>
                                <option value="">Select tag</option>
                                {TAG_OPTIONS.map(tag => (
                                    <option key={tag} value={tag}>{tag}</option>
                                ))}
                            </select>
                            <Button onclick={handleTagSave} disabled={!selectedTag} text='Save' width='25%'></Button>
                            <Button onclick={() => setEditingTag(false)} text='Cancel' width='25%'></Button>
                        </div>
                    ))
                }
            </div>
            <div className={`${style.info}`}>
                {transaction.tag ?
                    <>
                        <p>Percent of all {transaction.tag} transactions: {getTransactionPercentByTagAllTime(transaction.tag, transaction)}%</p>
                        <p>Percent this year's {transaction.tag} transactions: {getTransactionPercentByTagYear(transaction.tag, transaction)}%</p>
                        <p>Percent this month's {transaction.tag} transactions: {getTransactionPercentByTagMonth(transaction.tag, transaction)}%</p>
                    </>
                    :
                    <></>
                }
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <Button onclick={handleDelete} text='Delete Transaction' width='51%' type='secondary' color={'var(--color-red)'}></Button>
            </div>
        </div>
    );
};

export default React.memo(TransactionDetail);
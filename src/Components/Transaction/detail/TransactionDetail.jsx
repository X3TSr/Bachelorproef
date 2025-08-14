import React, { useState } from 'react'
import style from './TransactionDetail.module.css';

import * as modules from '../../../general-js/scripts';
import useDataFunctions from '../../../hooks/useDataFunctions';
import useFetchData from '../../../hooks/useFetchData';
import { dbUpdateTransaction } from '../../../firebase/firebase';

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
                <img style={{ width: `calc(${tagSize}/2)` }} src={`/tags/${tag}.svg`} alt={`${tag}-tag`} onError={handleImageError} />
            </div>
        )
    }

    const onTagChange = async (newTag) => {
        if (!data) return;

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
        console.log(modules.textCasingModule.toKebabCase(e.target.value));
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

    return (
        <div className={`${style.container}`}>
            <span className={`${style.backArrow}`} onClick={() => backFn()}>←</span>
            <div className='flex justifySpaceBetween'>
                <h2>{transaction.label}</h2>
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
                            <Button onclick={handleTagSave} disabled={!selectedTag} text='Save' width='25%'>
                                Save
                            </Button>
                            <Button onclick={() => setEditingTag(false)} text='Cancel' width='25%'>
                                Cancel
                            </Button>
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
        </div>
    );
};

export default TransactionDetail;
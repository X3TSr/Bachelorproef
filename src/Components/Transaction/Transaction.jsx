import React, { useState } from 'react'
import style from './Transaction.module.css';

import * as modules from '../../general-js/scripts'
import useDataFunctions from '../../hooks/useDataFunctions';

const Transaction = ({
    transaction,
    hasDate = false,
    onclick = () => { },
}) => {

    const { getTransactionDate } = useDataFunctions();

    const getColor = () => {
        return transaction.type == 'income' ? 'var(--color-green)' : 'var(--color-red)';
    }

    const handleImageError = (e) => {
        e.target.src = '/tags/unknown.svg';
    };

    const tagSize = '4rem'
    const getTag = () => {
        const tag = transaction.tag ?? 'unknown'
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

    return (
        <div className={`flex justifySpaceBetween alignCenter ${style.transaction}`} style={{ padding: '1rem' }} onClick={() => onclick()}>
            <div className={`flex alignCenter`} style={{ gap: '1rem', width: '80%' }}>
                <div style={{
                    width: `${tagSize}`
                }}>
                    {getTag()}
                </div>
                <p style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '1.8rem',
                    whiteSpace: 'nowrap',
                    width: '50%'
                }}>
                    {transaction.label ? modules.textCasingModule.toSentenceCase(transaction.label) : 'Unknown Transaction'}
                </p>
            </div>
            <div>
                {hasDate && <p>{getTransactionDate(transaction).day}/{getTransactionDate(transaction).month}/{getTransactionDate(transaction).year}</p>}
                <p style={{ color: `${getColor()}` }}>{transaction.type == 'income' ? transaction.value : `${transaction.value}`} €</p>
            </div>
        </div>
    );
};

export default Transaction;
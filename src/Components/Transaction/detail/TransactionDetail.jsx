import React from 'react'
import style from './TransactionDetail.module.css';
import useDataFunctions from '../../../hooks/useDataFunctions';

const TransactionDetail = ({
    transaction,
    backFn = () => { }
}) => {

    const {
        getTransactionDate,
        getTransactionPercentByTagAllTime,
        getTransactionPercentByTagYear,
        getTransactionPercentByTagMonth,
        getTransactionPercentByTagDay
    } = useDataFunctions();

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
        <div className={`${style.container}`}>
            <span className={`${style.backArrow}`} onClick={() => backFn()}>←</span>
            <div className='flex justifySpaceBetween'>
                <h2>{transaction.label}</h2>
                <h2>{getTransactionDate(transaction).day}/{getTransactionDate(transaction).month}/{getTransactionDate(transaction).year}</h2>
            </div>
            <h4 style={{ opacity: '.6' }}>Amount: € {transaction.type == 'income' ? transaction.value : `-${transaction.value}`}</h4>
            <div className={`${style.tag}`} style={{ marginTop: '4rem' }}>
                {getTag()}
                <h4>Tag: {transaction.tag ? transaction.tag : 'Unknown'}</h4>
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
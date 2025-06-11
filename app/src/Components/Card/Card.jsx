import React from 'react'
import style from './Card.module.css'

import * as modules from '../../general-js/scripts'

const Card = ({
    size = [0, 0],
    classN = '',
    theme = 'dark',
    type = 'default',
    number = 'XXX.XX',
    title = '',
    content = '',
    subDescription = '',
    subNumber = '',
    hideTitle,
    children
}) => {

    const checkType = () => {
        switch (type) {
            case 'text':
                return (
                    <div style={{ padding: '1rem 2rem' }}>
                        <h2>{title}</h2>
                        <p style={{ marginTop: '2rem' }}>{
                            content.split('\n').map((line, idx) => (
                                <React.Fragment key={idx}>
                                    {line}
                                    <br /><br />
                                </React.Fragment>
                            ))
                        }</p>
                    </div>
                )
            case 'budgetText':
                return (
                    <div className={`flex fdc alignRight`}>
                        <h2>€ {number}</h2>
                        <h4 className={`${style.cardTitle}`}>{content}</h4>
                    </div>
                )
            case 'budgetTextG':
                return (
                    <div className={`flex fdc alignRight`}>
                        <h2 style={{ color: `var(--color-green)` }}>€ {number}</h2>
                        <h4 className={`${style.cardTitle}`}>{content}</h4>
                    </div>
                )
            case 'budgetTextR':
                return (
                    <div className={`flex fdc alignRight`}>
                        <h2 style={{ color: `var(--color-red)` }}>€ {number}</h2>
                        <h4 className={`${style.cardTitle}`}>{content}</h4>
                    </div>
                )
            case 'graphBottom':
                return (
                    <div className={`flex fdc alignCenter`}>
                        <div className={`flex justifySpaceBetween w100`}>
                            {!hideTitle && <h3 className={`${style.cardTitle}`}>{content}</h3>}
                            {!hideTitle && number == 'XXX.XX' && <h3>{number}</h3>}
                            {!hideTitle && number < 0 && <h3 style={{ color: 'var(--color-red)' }}>€ {parseFloat(number).toFixed(2)}</h3>}
                            {!hideTitle && number >= 0 && <h3 style={{ color: 'var(--color-green)' }}>€ {parseFloat(number).toFixed(2)}</h3>}
                        </div>
                        <div className={`${style.graph}`}>
                            {children}
                        </div>
                    </div>
                )
            case 'graphTop':
                return (
                    <div className={`flex fdc alignCenter`}>
                        <div className={`${style.graph}`}>
                            {children}
                        </div>
                        <div className={`flex justifySpaceBetween w100`}>
                            {!hideTitle && <h3 className={`${style.cardTitle}`}>{content}</h3>}
                            {!hideTitle && number == 'XXX.XX' && <h3>{number}</h3>}
                            {!hideTitle && number < 0 && <h3 style={{ color: 'var(--color-red)' }}>€ {parseFloat(number).toFixed(2)}</h3>}
                            {!hideTitle && number >= 0 && <h3 style={{ color: 'var(--color-green)' }}>€ {parseFloat(number).toFixed(2)}</h3>}
                        </div>
                    </div>
                )
            case 'percent':
                return (
                    <div className={`flex fdc justifySpaceBetween alignCenter h100`}>
                        <h4 className={`${style.cardTitle}`}>{content}</h4>
                        <h1 style={{ color: 'var(--color-green)' }}>{number} %</h1>
                        <div style={{ justifySelf: 'end' }} className={`flex fdc alignCenter ${style.cardTitle}`}>
                            <p>{subDescription}</p>
                            <h4>€ {subNumber}</h4>
                        </div>
                    </div>
                )
            case 'transactions':
                return (
                    <div className={`${style.transactions}`}>
                        <div className={`flex alignRight justifySpaceBetween`} style={{ marginBottom: '2rem' }}>
                            <h2>Transactions</h2>
                            <p style={{ textDecoration: 'underline', cursor: 'pointer', opacity: '.6' }}>All transactions</p>
                        </div>
                        <div>
                            {children}
                        </div>
                    </div>
                )

            default:
                return (
                    <div></div>
                )
        }
    }

    return (
        <>
            <div /* style={{ width: size[0], height: size[1] }} */ className={`${style.card} ${classN}`}>
                {checkType()}
                <div className={`${style.background} ${style[theme]}`}></div >
            </div >
        </>
    );
};

export default Card;
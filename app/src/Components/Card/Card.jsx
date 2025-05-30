import React from 'react'
import style from './Card.module.css'

import * as modules from '../../general-js/scripts'

const Card = ({
    size = [0, 0],
    classN = '',
    theme = 'dark',
    type = 'default',
    number = 'XXX.XX',
    content = '',
    subDescription = '',
    subNumber = '',
}) => {

    const checkType = () => {
        switch (type) {
            case 'budgetText':
                return (
                    <div className={`${style.alignLeft}`}>
                        <h2>€ {number}</h2>
                        <h4 className={`${style.cardTitle}`}>{content}</h4>
                    </div>
                )
            case 'budgetTextG':
                return (
                    <div className={`${style.alignLeft}`}>
                        <h2 style={{ color: `var(--color-green)` }}>€ {number}</h2>
                        <h4 className={`${style.cardTitle}`}>{content}</h4>
                    </div>
                )
            case 'budgetTextR':
                return (
                    <div className={`${style.alignLeft}`}>
                        <h2 style={{ color: `var(--color-red)` }}>€ {number}</h2>
                        <h4 className={`${style.cardTitle}`}>{content}</h4>
                    </div>
                )
            case 'percent':
                return (
                    <div className={`${style.alignCenter}`}>
                        <h4 className={`${style.cardTitle}`}>{content}</h4>
                        <h1 style={{ color: 'var(--color-green)' }}>{number} %</h1>
                        <div className={`${style.alignCenter} ${style.cardTitle}`}>
                            <p>{subDescription}</p>
                            <h4>{subNumber}</h4>
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
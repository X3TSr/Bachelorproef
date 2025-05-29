import React from 'react'
import style from './Card.module.css'

import * as modules from '../../general-js/scripts'

const Card = ({ size = [0, 0], theme = 'dark', type = 'default', content = '' }) => {

    const checkType = () => {
        switch (type) {
            case 'budgetText':
                return (
                    <div className={`${style.alignLeft}`}>
                        <h2>€ XXX.XX</h2>
                        <h4>{content}</h4>
                    </div>
                )
            case 'budgetTextG':
                return (
                    <div className={`${style.alignLeft}`}>
                        <h2 style={{ color: `var(--color-green)` }}>€ XXX.XX</h2>
                        <h4>{content}</h4>
                    </div>
                )
            case 'budgetTextR':
                return (
                    <div className={`${style.alignLeft}`}>
                        <h2 style={{ color: `var(--color-red)` }}>€ XXX.XX</h2>
                        <h4>{content}</h4>
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
            <div /* style={{ width: size[0], height: size[1] }} */ className={`${style.card}`}>
                {checkType()}
                <div className={`${style.background} ${style[theme]}`}></div >
            </div >
        </>
    );
};

export default Card;
import React, { forwardRef } from 'react'
import style from './Card.module.css'
import Input from '../Input/Input';

const Card = ({
    classN = '',
    theme = 'dark',
    type = 'default',
    number = 'XXX.XX',
    title = '',
    content = '',
    subDescription = '',
    subNumber = '',
    hideTitle,
    score = 0,
    children,
    onchange = () => { },
    onclick = () => { },
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
                            <h2 className={`${style.cardTitle}`}>Transactions</h2>
                            <p style={{ textDecoration: 'underline', cursor: 'pointer', opacity: '.6' }} onClick={() => onclick()}>All transactions</p>
                        </div>
                        <div>
                            {children}
                        </div>
                    </div>
                )
            case 'healthMeter':
                return (
                    <div className={`flex fdc h100`}>
                        <div className={`flex alignRight justifySpaceBetween`} style={{ marginBottom: '2rem' }}>
                            <h2 className={`${style.cardTitle}`}>Business Health</h2>
                            <h4 style={{ opacity: '.6' }}>{content}</h4>
                        </div>
                        <div className={`${style.healthMeter}`}>
                            <span className={`${style.healthMeterBlock}`} data-selected={score == -3 ? true : false}></span>
                            <span className={`${style.healthMeterBlock}`} data-selected={score == -2 ? true : false}></span>
                            <span className={`${style.healthMeterBlock}`} data-selected={score == -1 ? true : false}></span>
                            <span className={`${style.healthMeterBlock}`} data-selected={score == 0 ? true : false}></span>
                            <span className={`${style.healthMeterBlock}`} data-selected={score == 1 ? true : false}></span>
                            <span className={`${style.healthMeterBlock}`} data-selected={score == 2 ? true : false}></span>
                        </div>
                    </div>
                )
            case 'sliderProjection':
                return (
                    <div className={`flex fdc`} style={{ gap: '2rem' }}>
                        <h2 className={`${style.cardTitle}`}>{title}</h2>
                        <div className={`${style.sliderValues}`}>
                            <p style={{ color: 'var(--color-red' }}>-50%</p>
                            <p style={{ color: 'var(--color-white' }}>0%</p>
                            <p style={{ color: 'var(--color-green' }}>+50%</p>
                        </div>
                        <Input type='range' min={-50} max={50} onchange={onchange} content={content} />
                    </div>
                )

            default:
                return (
                    <></>
                )
        }
    }

    return (
        <>
            <div className={`${style.card} ${classN}`}>
                {checkType()}
                <div className={`${style.background} ${style[theme]}`}></div >
            </div >
        </>
    );
};

export default Card;
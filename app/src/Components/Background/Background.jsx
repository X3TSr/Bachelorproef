import React from 'react'
import style from './Background.module.css'

const Background = () => {
    return (
        <div className={`${style.parent}`}>
            <div className={`${style.container}`}>
                <div className={`${style.circle}`}></div>
                <div className={`${style.card}`}>
                    <div className={`${style.cardBg}`}></div >
                </div>
            </div>
            <div className={`${style.background}`}></div>
        </div>
    );
};

export default Background;
import React from 'react'
import style from './NotFound.module.css'

const NotFound = () => {
    return (
        <section className={`${style.sectionNotFound}`}>
            <h1 className={`${style.title}`}>To be or not to be?</h1>
            <h2 className={`${style.subtitle}`}>But you apear to be.. lost</h2>
        </section>
    );
};

export default NotFound;
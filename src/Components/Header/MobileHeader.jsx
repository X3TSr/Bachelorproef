import React from 'react'
import style from './MobileHeader.module.css'
import { Link } from 'react-router-dom';

const MobileHeader = () => {

    return (
        <header id='header' className={`${style.header}`}>
            <nav>
                <Link to="/" data-alt='Home'>
                    <span className="material-symbols-outlined">home</span>
                </Link>
                <Link to="/taxes" data-alt='Taxes'>
                    <span className="material-symbols-outlined">heap_snapshot_large</span>
                </Link>
                <Link to="/future" data-alt='Future'>
                    <span className="material-symbols-outlined">more_time</span>
                </Link>
                <Link to="/cashflow" data-alt='Cashflow'>
                    <span className="material-symbols-outlined">payments</span>
                </Link>
                <Link to="/profile" data-alt='Profile'>
                    <span className="material-symbols-outlined">account_circle</span>
                </Link>
            </nav>
        </header>
    );
};

export default MobileHeader;
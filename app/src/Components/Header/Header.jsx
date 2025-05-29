import React from 'react'
import style from './Header.module.css'
import { Link } from 'react-router-dom';
import { useUserStore } from '../../Store/userStore';

const Header = () => {

    const logout = useUserStore((state) => state.logout)
    const handleLogout = async () => {
        await logout()
    }

    const handleExpand = () => {
        const header = document.getElementById('header');
        header.classList.toggle(`${style.expanded}`);
    }

    return (
        <header id='header'>
            <nav>
                <img src="/logo/logo-small.svg" alt="Logo" onClick={handleExpand} />
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
            </nav>
            <div className={`${style.subnav}`}>
                <Link to="/profile" data-alt='Profile'>
                    <span className="material-symbols-outlined">account_circle</span>
                </Link>
                <Link onClick={handleLogout} data-alt='Logout'>
                    <span className="material-symbols-outlined">logout</span>
                </Link>
            </div>
        </header>
    );
};

export default Header;
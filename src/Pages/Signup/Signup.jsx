import React, { useRef, useState } from 'react'
import style from './Signup.module.css'
import ROUTES from '../../consts/ROUTES';
import { useUserStore } from '../../Store/userStore';
import { Link, Navigate } from 'react-router-dom';

import Input from '../../Components/Inputs/Input';
import Button from '../../Components/Button/Button';

const Signup = () => {

    const signup = useUserStore((state) => state.signup);
    const isLoggedIn = useUserStore((state) => state.isLoggedIn)
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const signinBtn = useRef();


    if (isLoggedIn) {
        return <Navigate to={'/'} />
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        try {
            await signup(email, password, firstName, lastName, displayName)
        } catch (err) {
            setError(err.message)
        }
    }

    const checkEnter = (e) => {
        if (e.key === 'Enter') {
            signinBtn.current?.click();
        }
    }


    return (
        <section className={`${style.sectionLogin}`}>
            <div className={`${style.containerImage}`}>
                <div className={`${style.loginVector}`}></div>
            </div>
            <div className={`${style.containerLogin}`}>
                <img src="/logo/logo-login.svg" alt="Logo" />
                {error && <p style={{ color: 'var(--color-red)' }}>{error}</p>}
                <Input type='text' htmlFor='firstName' onchange={setFirstName} content={firstName} onKeyDown={checkEnter} />
                <Input type='text' htmlFor='lastName' onchange={setLastName} content={lastName} onKeyDown={checkEnter} />
                <Input type='text' htmlFor='displayName' onchange={setDisplayName} content={displayName} onKeyDown={checkEnter} />
                <Input type='email' htmlFor='email' onchange={setEmail} content={email} onKeyDown={checkEnter} />
                <Input type='password' htmlFor='password' onchange={setPassword} content={password} onKeyDown={checkEnter} />
                <Button text='Maak account' onclick={handleSignup} classN={`${style.cta_btn}`} ref={signinBtn} />
                <p>Al een account? Geen probleem klik <Link to={ROUTES.login} className={`${style.switch_link}`}>hier</Link> om aan te melden</p>
            </div>
        </section>
    );
};

export default Signup;
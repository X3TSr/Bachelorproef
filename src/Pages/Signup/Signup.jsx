import React, { useRef, useState } from 'react'
import style from './Signup.module.css'
import ROUTES from '../../consts/ROUTES';
import { useUserStore } from '../../Store/userStore';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import Card from '../../Components/Card/Card';
import { useIsMobile } from '../../hooks/useIsMobile';

const Signup = () => {

    const navigate = useNavigate();

    const signup = useUserStore((state) => state.signup);
    const isLoggedIn = useUserStore((state) => state.isLoggedIn)
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const signinBtn = useRef();
    const isMobile = useIsMobile();


    if (isLoggedIn) {
        return <Navigate to={'/'} />
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        try {
            await signup(email, password, firstName, lastName, displayName)
            navigate('/login', { replace: true });
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
        <section className={`${style.sectionLogin} ${isMobile ? style.mobileSectionLogin : ''}`}>
            {!isMobile &&
                <div className={`${style.containerImage}`}>
                    <div className={`${style.loginVector}`}></div>
                </div>
            }
            <div className={`${style.containerLogin}  ${isMobile ? style.mobileContainerLogin : ''}`}>
                <img src="/logo/logo-login.svg" alt="Logo" />
                {error && <p style={{ color: 'var(--color-red)' }}>{error}</p>}
                <Input type='text' htmlFor='firstName' onchange={setFirstName} content={firstName} onKeyDown={checkEnter} />
                <Input type='text' htmlFor='lastName' onchange={setLastName} content={lastName} onKeyDown={checkEnter} />
                <Input type='text' htmlFor='displayName' onchange={setDisplayName} content={displayName} onKeyDown={checkEnter} />
                <Input type='email' htmlFor='email' onchange={setEmail} content={email} onKeyDown={checkEnter} />
                <Input type='password' htmlFor='password' onchange={setPassword} content={password} onKeyDown={checkEnter} />
                <Button text='Maak account' onclick={handleSignup} classN={`${style.cta_btn}`} ref={signinBtn} />
                <p>Already have an account? Login <Link to={ROUTES.login} className={`${style.switch_link}`}>here</Link></p>
                <Card classN={`${style.mobileCard}`} />
            </div>
        </section>
    );
};

export default Signup;
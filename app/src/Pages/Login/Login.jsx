import React, { useRef, useState } from 'react';
import style from './Login.module.css'

import ROUTES from '../../consts/ROUTES';
import { useUserStore } from '../../Store/userStore'
import { Link, Navigate } from 'react-router-dom';

import Input from '../../Components/Inputs/Input'
import Button from '../../Components/Button/Button'

function Login() {

  const login = useUserStore((state) => state.login);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const loginBtn = useRef();

  if (isLoggedIn) {
    return <Navigate to={'/'} />
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message)
    }
  }

  const checkEnter = (e) => {
    if (e.key === 'Enter') {
      loginBtn.current?.click();
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
        <Input type='email' htmlFor='email' onchange={setEmail} content={email} onKeyDown={checkEnter} />
        <Input type='password' htmlFor='Password' onchange={setPassword} content={password} onKeyDown={checkEnter} />
        <Button text='Login' onclick={handleLogin} ref={loginBtn} />
        <p>Nog geen account? Geen probleem maak <Link to={ROUTES.signup} className={`${style.switch_link}`}>hier</Link> een nieuw account aan</p>
      </div>
    </section>
  )
}

export default Login

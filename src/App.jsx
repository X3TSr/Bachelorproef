import './App.css'
import { useEffect, useState } from 'react'
import { useUserStore } from './Store/userStore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/firebase'

import Header from './Components/Header/Header'
import Router from './Router/Router'

import Background from './Components/Background/Background'
import { useIsMobile } from './hooks/useIsMobile'
import MobileHeader from './Components/Header/MobileHeader'

function App() {

  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const setUser = useUserStore((state) => state.setUser)
  const logout = useUserStore((state) => state.logout)
  const isMobile = useIsMobile();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
      } else {
        logout()
      }
    })

    return () => unsubscribe()
  }, [setUser, logout])

  return (
    <>
      {isLoggedIn ? (isMobile ? <MobileHeader /> : <Header />) : null}
      <Router />
      {isLoggedIn ? <Background /> : null}
    </>
  )
}

export default App
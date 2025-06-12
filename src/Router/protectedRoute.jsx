import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../Store/userStore'
import { useEffect } from 'react';

import Loading from '../Components/Loading/Loading';

export default function ProtectedRoute({ children }) {
    const isLoggedIn = useUserStore((state) => state.isLoggedIn)
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login', { replace: true })
        }
    }, [isLoggedIn, navigate])

    if (!isLoggedIn) return <Loading />

    return children
}
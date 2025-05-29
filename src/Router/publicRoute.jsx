import { Navigate } from 'react-router-dom'
import { useUserStore } from '../Store/userStore'

export default function PublicRoute({ children }) {
    const isLoggedIn = useUserStore((state) => state.isLoggedIn)

    if (isLoggedIn) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}
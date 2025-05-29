import { useUserStore } from '../Store/userStore'

export default function ProtectedRoute({ children }) {
    const isLoggedIn = useUserStore((state) => state.isLoggedIn)

    if (!isLoggedIn) {
        location.href = location.href.replace(/\/.*/gm, '/login')
    }
    else {
        return children
    }
}
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { useUserStore } from "../Store/userStore";


export default function useFetchUser(uidParam) {
    const getUser = useUserStore((state) => state.getUser);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const uid = uidParam || auth.currentUser?.uid;
                if (!uid) throw new Error("No UID provided or user not logged in");

                const email = auth.currentUser?.email;

                const data = await getUser(uid)
                setUser({ ...data, email });
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [uidParam, getUser])

    return { user, loading, error }
}
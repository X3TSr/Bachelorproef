import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { create } from "zustand";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export const useUserStore = create((set) => ({
    user: null,
    isLoggedIn: false,
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            set({
                user: {
                    uid: user.uid,
                    email: user.email,
                },
                isLoggedIn: true,
            })
        } catch (error) {
            console.error('Login failed:', error)
            throw error
        }
    },
    logout: async () => {
        await signOut(auth)
        set({ user: null, isLoggedIn: false })
    },
    signup: async (email, password, firstName, lastName, displayName) => {
        try {
            const userCredentials = createUserWithEmailAndPassword(auth, email, password);
            const user = (await userCredentials).user

            await updateProfile(user, {
                displayName,
            });

            await setDoc(doc(db, 'users', user.uid), {
                firstName,
                lastName,
                displayName,
                firstSignin: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })

            await setDoc(doc(db, 'data', user.uid), {
                owner: user.uid,
                data: ''
            })
        } catch (error) {
            console.error('Signup failed:', error)
            throw error
        }
    },
    setUser: (firebaseUser) => {
        set({
            user: {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
            },
            isLoggedIn: true,
        })
    },
    getUser: async (uid) => {
        const userDoc = await getDoc(doc(db, 'users', uid))
        if (userDoc.exists()) {
            return userDoc.data();
        }
        else {
            console.warn("No user profile found!")
            return null
        }
    }
}))
import { useEffect, useCallback } from "react";

import * as modules from '../general-js/scripts';
import { auth, dbReadDoc } from '../firebase/firebase';
import useFetchUser from "./useFetchUser";
import { useUserStore } from '../Store/userStore';

export default function useFetchData() {
    const { user } = useFetchUser();

    const dbCryptData = useUserStore(state => state.dbCryptData);
    const data = useUserStore(state => state.data);
    const setDbCryptData = useUserStore(state => state.setDbCryptData);
    const setData = useUserStore(state => state.setData);

    const fetchData = useCallback(async () => {
        if (!user) return;

        try {
            const res = await dbReadDoc('data', auth.currentUser.uid);
            // Only update store if crypt changed
            if (!dbCryptData || dbCryptData.data !== res?.data) {
                setDbCryptData(res);
            }
        } catch (error) {
            console.error(error);
        }
    }, [user, dbCryptData, setDbCryptData]);

    // Fetch when user changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Decrypt and set usable data
    useEffect(() => {
        if (!dbCryptData) return;
        try {
            const decr = modules.encriptionModule.decompressFromBase64(dbCryptData.data);
            const jsonData = modules.encriptionModule.stringToJSON(decr);
            // Only set data if different to avoid triggering subscribers unnecessarily
            const currentData = data;
            const currStr = currentData ? JSON.stringify(currentData) : null;
            const newStr = jsonData ? JSON.stringify(jsonData) : null;
            if (currStr !== newStr) {
                setData(jsonData);
            }
        } catch (e) {
            console.error('Error decrypting data', e);
        }
    }, [dbCryptData, data, setData]);

    return { dbCryptData, data, refetch: fetchData };
}
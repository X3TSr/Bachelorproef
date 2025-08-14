import { useEffect, useState, useCallback } from "react";

import * as modules from '../general-js/scripts';
import { auth, dbReadDoc } from '../firebase/firebase';
import useFetchUser from "./useFetchUser";

export default function useFetchData() {
    const { user } = useFetchUser();

    const [dbCryptData, setDbCryptData] = useState();
    const [data, setData] = useState();

    const fetchData = useCallback(async () => {
        if (!user) return;

        try {
            const res = await dbReadDoc('data', auth.currentUser.uid);
            setDbCryptData(res);
        } catch (error) {
            console.error(error);
        }
    }, [user]);

    // Fetch when user changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Decrypt and set usable data
    useEffect(() => {
        if (!dbCryptData) return;

        const decr = modules.encriptionModule.decompressFromBase64(dbCryptData.data);
        const jsonData = modules.encriptionModule.stringToJSON(decr);

        setData(jsonData);
    }, [dbCryptData]);

    return { dbCryptData, data, refetch: fetchData };
}
import { useEffect, useState } from "react";

import * as modules from '../general-js/scripts'
import { auth, db, dbAddDoc, dbReadDoc, dbReadDocs } from '../firebase/firebase';
import useFetchUser from "./useFetchUser";


export default function useFetchData() {

    const { user } = useFetchUser();

    const [dbCryptData, setDbCryptData] = useState();
    const [data, setData] = useState();

    useEffect(() => {
        if (!user) return;

        dbReadDoc('data', auth.currentUser.uid)
            .then(res => {
                setDbCryptData(res);
            })
            .catch(error => {
                console.error(error)
            });
    }, [user])

    useEffect(() => {
        if (!dbCryptData) return;

        const decr = modules.encriptionModule.decompressFromBase64(dbCryptData.data);
        const jsonData = modules.encriptionModule.stringToJSON(decr);

        setData(jsonData);
    }, [dbCryptData])

    return { dbCryptData, data }
}
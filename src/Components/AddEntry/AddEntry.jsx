import React, { useEffect, useState } from 'react'
import style from './AddEntry.module.css'

import Button from '../Button/Button';
import Select from '../Select/Select';
import Input from '../Input/Input';
import Card from '../Card/Card';
import { dbAddDoc, dbFillNewData } from '../../firebase/firebase';

const AddEntry = ({
    handleStageChange = () => { }
}) => {

    const date = new Date;

    const [check, setCheck] = useState(false);

    const [createEntryType, setCreateEntryType] = useState('income');
    const [createEntryLabel, setCreateEntryLabel] = useState('');
    const [createEntryValue, setCreateEntryValue] = useState(0);
    const [createEntryDate, setCreateEntryDate] = useState(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`);

    const reformatDate = (date) => {
        if (date.split('-').length > 2) return date;

        const day = date.split('/')[0]?.padStart(2, '0');
        const month = date.split('/')[1]?.padStart(2, '0');
        const year = date.split('/')[2];

        return `${year}-${month}-${day}`
    }

    const checkFields = () => {
        setCheck(createEntryLabel != '');
        setCheck(createEntryValue != 0);
    };

    useEffect(() => {
        if (!check) return;

        const checkType = () => {
            if (createEntryType.toLowerCase() == 'income') return createEntryValue;
            if (createEntryType.toLocaleLowerCase() == 'expense') return `-${createEntryValue}`
        }

        const transactions = [
            {
                "Free-format reference": `${createEntryLabel}`,
                "Amount": `${checkType()}`,
                "Date": `${createEntryDate}`
            }
        ]

        dbFillNewData(transactions);
        handleStageChange(3);
    }, [check])

    useEffect(() => {
        setCreateEntryDate(reformatDate(createEntryDate));
    }, [createEntryDate])

    return (
        <div className={`${style.container}`}>
            <Select options={['Income', 'expense']} onchange={setCreateEntryType} />
            <Input content={createEntryLabel} onchange={setCreateEntryLabel} type='text' />
            <Input content={createEntryValue} onchange={setCreateEntryValue} type='number' />
            <Input type='date' content={createEntryDate} onchange={setCreateEntryDate} />
            <Button type='primary' text='Add Entry' fontSize='h4' onclick={checkFields} />

            <Card classN={`${style.containerBackground}`} />
        </div>
    );
};

export default AddEntry;
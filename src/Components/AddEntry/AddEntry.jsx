import React, { useEffect, useState } from 'react'
import style from './AddEntry.module.css'

import Button from '../Button/Button';
import Select from '../Select/Select';
import Input from '../Input/Input';
import Card from '../Card/Card';
import { dbAddData } from '../../firebase/firebase';

const AddEntry = ({
    onComplete = () => { }
}) => {

    const date = new Date;

    const [check, setCheck] = useState(false);

    const [createEntryType, setCreateEntryType] = useState('income');
    const [createEntryLabel, setCreateEntryLabel] = useState('');
    const [createEntryValue, setCreateEntryValue] = useState(0);
    const [createEntryDate, setCreateEntryDate] = useState(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);

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

        const transactions = [
            {
                "label": `${createEntryLabel}`,
                "value": `${createEntryValue}`,
                "date": `${createEntryDate.split('-').reverse().join('')}`,
                "type": `${createEntryType}`,
                "tag": ``,
            }
        ]

        dbAddData(transactions);
        onComplete();
    }, [check])

    useEffect(() => {
        setCreateEntryDate(reformatDate(createEntryDate));
    }, [createEntryDate])

    return (
        <div className={`${style.container}`}>
            <Select options={['Income', 'Expense']} onchange={setCreateEntryType} />
            <Input content={createEntryLabel} onchange={setCreateEntryLabel} type='text' htmlFor='Transaction Name' />
            <Input content={createEntryValue} onchange={setCreateEntryValue} type='number' htmlFor='Transaction Value' />
            <Input type='date' content={createEntryDate} onchange={setCreateEntryDate} htmlFor='Transaction Date' />
            <Button type='primary' text='Add Entry' fontSize='h4' onclick={checkFields} />

            <Card classN={`${style.containerBackground}`} />
        </div>
    );
};

export default AddEntry;
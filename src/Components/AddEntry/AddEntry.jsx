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
    const [createEntryInstallments, setCreateEntryInstallments] = useState(1);
    const [createEntryTag, setCreateEntryTag] = useState('');

    const TAG_OPTIONS = [
        'Auto-detect',
        'Food',
        'Marketing',
        'Social Contribution',
        'Taxes',
        'Travel',
        'Water & Electricity',
        'Transport',
        'Shopping',
        'Bills',
        'Health',
        'Entertainment'
    ];

    const reformatDate = (date) => {
        if (date.split('-').length > 2) return date;

        const day = date.split('/')[0]?.padStart(2, '0');
        const month = date.split('/')[1]?.padStart(2, '0');
        const year = date.split('/')[2];

        return `${year}-${month}-${day}`
    }

    const checkFields = () => {
        // require a non-empty label and a non-zero value
        const valid = createEntryLabel !== '' && parseFloat(createEntryValue) !== 0;
        setCheck(valid);
    };

    useEffect(() => {
        if (!check) return;

        const valueNum = parseFloat(createEntryValue);
        const transactions = [];

        // Date is stored as DDMMYYYY. createEntryDate is in YYYY-MM-DD format after reformatDate.
        const parts = createEntryDate.split('-');
        const baseYear = parseInt(parts[0]);
        const baseMonth = parts[1].padStart(2, '0');
        const baseDay = parts[2].padStart(2, '0');

        if (createEntryType === 'expense' && parseInt(createEntryInstallments) > 1) {
            const n = parseInt(createEntryInstallments);
            // split value evenly in cents to avoid floating rounding issues
            const totalCents = Math.round(valueNum * 100);
            const baseCents = Math.floor(totalCents / n);
            const remainder = totalCents - baseCents * n; // distribute remainder into first payment(s)

            for (let i = 0; i < n; i++) {
                let cents = baseCents + (i === 0 ? remainder : 0);
                const installmentValue = (cents / 100).toFixed(2);
                const year = baseYear + i;
                const dateString = `${baseDay}${baseMonth}${year}`;
                transactions.push({
                    label: `${createEntryLabel} (${i + 1}/${n})`,
                    value: `${installmentValue}`,
                    date: `${dateString}`,
                    type: `${createEntryType}`,
                    tag: `${createEntryTag}`,
                });
            }
        } else {
            transactions.push({
                label: `${createEntryLabel}`,
                value: `${valueNum.toFixed(2)}`,
                date: `${createEntryDate.split('-').reverse().join('')}`,
                type: `${createEntryType}`,
                tag: `${createEntryTag}`,
            });
        }

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
            {createEntryType === 'expense' && (
                <Input content={createEntryInstallments} onchange={setCreateEntryInstallments} type='number' htmlFor='Pay over (years)' />
            )}
            <Select
                options={TAG_OPTIONS.map(tag => tag)}
                onchange={setCreateEntryTag}
            />
            <Input type='date' content={createEntryDate} onchange={setCreateEntryDate} htmlFor='Transaction Date' />
            <Button type='primary' text='Add Entry' fontSize='h4' onclick={checkFields} />

            <Card classN={`${style.containerBackground}`} />
        </div>
    );
};

export default AddEntry;
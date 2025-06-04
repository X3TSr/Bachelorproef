import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import style from './Dashboard.module.css'

import * as modules from '../../general-js/scripts'
import ROUTES from '../../consts/ROUTES';
import useFetchUser from '../../hooks/useFetchUser';
import useFetchData from '../../hooks/useFetchData';

import testData from '../../consts/testData.json';

import Button from '../../Components/Button/Button';
import Card from '../../Components/Card/Card';
import Loading from '../../Components/Loading/Loading';
import useDataFunctions from '../../hooks/useDataFunctions';
import Intro from '../Intro/Intro';

const Dashboard = () => {

    const { user, loading, error } = useFetchUser();
    const { data } = useFetchData();
    const {
        getYearNet,
        getAllTimeHighestIncome,
        getAllTimeNet,
        getAllTimeTotalIncome,
        getAllTimeTotalExpenses
    } = useDataFunctions();

    if (loading || !data) return <Loading />
    if (error) return <p style={{ color: 'var(--color-red)' }}>Error: {error}</p>
    if (!user) return <p>Nothing to show</p>


    if (user.firstSignin) return <Intro />

    if (data) return (
        <>
            <section className={`${style.sectionDashboard}`}>
                <div className={`${style.title}`}>
                    <h1>Dashboard</h1>
                    <h3>Welcome back <span className='colorPrimary'>{user.firstName}</span></h3>
                </div>
                <div className={`${style.content}`}>
                    <div className={`${style.cardContainer}`}>
                        <Card type='budgetText' content='Total' number={getAllTimeNet()} />
                        <Card type='budgetTextG' content='Income' number={getAllTimeTotalIncome()} />
                        <Card type='budgetTextR' content='Expenses' number={getAllTimeTotalExpenses()} />
                        <Card type='graph' classN='span2' content='This Year Net' number={getYearNet()} />
                        <Card
                            type='percent'
                            content='Year High Income'
                            number={(getAllTimeHighestIncome()?.value ?? 1 / getAllTimeTotalIncome() == 0 ? 1 : getAllTimeTotalIncome() * 100).toFixed(2)}
                            subDescription={getAllTimeHighestIncome()?.label}
                            subNumber={getAllTimeHighestIncome()?.value}
                        />
                    </div>
                    <Link to={ROUTES.cashflow}>
                        <Button height='auto' type='primary' fontSize='h4' text='Add Cashflow' />
                    </Link>
                </div>
            </section>
        </>
    );
};

export default Dashboard;
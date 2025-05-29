import React from 'react'
import style from './Dashboard.module.css'
import useFetchUser from '../../hooks/useFetchUser';

import Button from '../../Components/Button/Button';
import Card from '../../Components/Card/Card';

const Dashboard = () => {

    const { user, loading, error } = useFetchUser();

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>
    if (!user) return <p>Nothing to show</p>

    return (
        <>
            <section className={`${style.sectionDashboard}`}>
                <div className={`${style.title}`}>
                    <h1>Dashboard</h1>
                    <h3>Welcome back <span className='colorPrimary'>{user.firstName}</span></h3>
                </div>
                <div className={`${style.content}`}>
                    <div className={`${style.cardContainer}`}>
                        <div className={`${style.top}`}>
                            <Card type='budgetText' content='Total' />
                            <Card type='budgetText' content='Income' />
                            <Card type='budgetText' content='Expenses' />
                        </div>
                        <div className={`${style.bottom}`}>

                        </div>
                    </div>
                    <Button type='primary' />
                </div>
            </section>
        </>
    );
};

export default Dashboard;
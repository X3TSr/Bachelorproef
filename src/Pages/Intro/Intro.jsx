import React, { useState } from 'react'
import style from './Intro.module.css'
import Papa from 'papaparse';

import * as modules from '../../general-js/scripts'
import useFetchUser from '../../hooks/useFetchUser';
import { auth, db, dbFillNewData } from '../../firebase/firebase';

import Loading from '../../Components/Loading/Loading';
import Button from '../../Components/Button/Button';
import AddEntry from '../../Components/AddEntry/AddEntry';
import { doc, updateDoc } from 'firebase/firestore';

const Intro = () => {

    const { user, loading, error } = useFetchUser();
    const [stage, setStage] = useState(0);

    const inputRef = React.useRef();

    if (loading) return <Loading />
    if (error) return <p style={{ color: 'var(--color-red)' }}>Error: {error}</p>
    if (!user) return <p>No userdata found</p>


    const handleAddCSV = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                dbFillNewData(results.data);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
            }
        });

        setStage(3)
    };



    const handleCreateEntry = () => {
        setStage(2)
    }



    const getStageComponent = () => {
        switch (stage) {
            case 0:
                return (
                    <>
                        <h1 className={`${style.heroTitle}`}>Welcome <span className='colorPrimary'>{user.firstName}</span><br /> This is your BudgetBuddy</h1>
                        <p className={`${style.heroDescription}`}>
                            BudgetBuddy is a smart, user-friendly financial dashboard that helps
                            freelancers and small business owners in Belgium track income,
                            expenses, and taxes with clarity. Get real-time insights,
                            visualize your finances, and stay in control
                        </p>
                        <Button text='Continue' width='60vw' height='auto' fontSize='h3' onclick={() => setStage(1)} />
                    </>
                )
            case 1:
                return (
                    <>
                        <h1 className={`${style.heroTitle}`}>First steps</h1>
                        <p className={`${style.heroDescription}`}>
                            To get started, you can upload a CSV with your financial data or create your first entry manually<br />
                            Not ready yet? No worries, you can skip this step and do this later at anytime.
                        </p>
                        <div className={`${style.buttonContainer}`}>
                            <Button text='Add CSV (KBC)' type='secondary' fontSize='h4' onclick={() => inputRef.current.click()} />
                            <input
                                type="file"
                                accept=".csv"
                                ref={inputRef}
                                onChange={handleAddCSV}
                                style={{ display: 'none' }}
                            />
                            <Button text='Create Entry' type='secondary' fontSize='h4' onclick={handleCreateEntry} />
                            <Button text='Continue' type='secondary' fontSize='h4' onclick={() => setStage(4)} />
                        </div>
                    </>
                )
            case 2:
                return (
                    <>
                        <h1 className={`${style.heroTitle}`}>Adding your first entry</h1>
                        <p className={`${style.heroDescription}`}>
                            To add your first entry, simply fill in the details below.
                            Each entry will be saved, and you can add more at any time.
                            The type indicates whether it's income or an expense,
                            the label serves as a title, the value is the amount,
                            and the date is when the entry occurred.
                        </p>
                        <div className={`${style.buttonContainer}`}>
                            <AddEntry onComplete={() => setStage(3)} />
                        </div>
                    </>
                )
            case 3:
                {
                    updateDoc(doc(db, 'users', auth.currentUser.uid), {
                        firstSignin: false
                    })
                }
                return (
                    <>
                        <h1 className={`${style.heroTitle}`}>Great!</h1>
                        <p className={`${style.heroDescription}`}>
                            You've successfully added your first entry to BudgetBuddy.
                            Great start! Now continue by adding more entries to build
                            a complete and accurate overview of your financial activity.
                        </p>
                        <Button text='Continue To Dashboard' fontSize='h4' width='40%' onclick={() => location.reload()} />
                    </>
                )
            case 4:
                {
                    dbFillNewData([]);
                    updateDoc(doc(db, 'users', auth.currentUser.uid), {
                        firstSignin: false
                    })
                }
                return (
                    <>
                        <h1 className={`${style.heroTitle}`}>Great!</h1>
                        <p className={`${style.heroDescription}`}>
                            Congratulations! Your BudgetBuddy is now successfully configured.
                            You can begin exploring the application right away.
                            To unlock the full potential of your financial insights,
                            don't forget to add your income and expenses in the Cashflow tab,
                            this will enable you to visualize your data effectively.
                        </p>
                        <Button text='Continue To Dashboard' fontSize='h4' width='40%' onclick={() => location.reload()} />
                    </>
                )

            default:
                return (
                    <Loading />
                )
        }
    }

    return (
        <>
            <section className={`${style.sectionIntro}`}>
                {getStageComponent()}
            </section>
        </>
    );
};

export default Intro;
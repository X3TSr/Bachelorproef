import React from 'react'
import style from './Profile.module.css'
import { Link } from 'react-router-dom';

import useFetchUser from '../../hooks/useFetchUser';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useUserStore } from '../../Store/userStore';

import InputText from '../../Components/Input/Input';
import Loading from '../../Components/Loading/Loading';
import Button from '../../Components/Button/Button';

const Profile = () => {

    const { user, loading, error } = useFetchUser();
    const logout = useUserStore((state) => state.logout)
    const isMobile = useIsMobile();

    if (loading) return <Loading />;
    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>No profile data found.</p>;

    const edit = (e) => {
        e.target.parentElement.firstChild.lastChild.classList.toggle('editable')
    }

    const handleLogout = async () => {
        await logout()
    }

    return (
        <section>
            <h1>{user.firstName} {user.lastName}</h1>
            <InputText htmlFor='email' type='email' editable editOnClick={edit} content={user.email} />
            <InputText htmlFor='username' type='text' editable editOnClick={edit} content={user.displayName} />
            <InputText htmlFor='firstName' type='text' editable editOnClick={edit} content={user.firstName} />
            <InputText htmlFor='lastName' type='text' editable editOnClick={edit} content={user.lastName} />
            <Button text={'Logout'} onclick={handleLogout} fontSize={'h4'} />
        </section>
    );
};

export default Profile;
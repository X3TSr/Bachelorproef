import React from 'react'
import style from './Profile.module.css'
import useFetchUser from '../../hooks/useFetchUser';
import InputText from '../../Components/Inputs/Input';

const Profile = () => {

    const { user, loading, error } = useFetchUser();

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!user) return <p>No profile data found.</p>;

    const edit = (e) => {
        e.target.parentElement.firstChild.lastChild.classList.toggle('editable')
    }

    return (
        <section>
            <h1>{user.firstName} {user.lastName}</h1>
            <InputText htmlFor='email' type='email' editable editOnClick={edit} content={user.email} />
            <InputText htmlFor='username' type='text' editable editOnClick={edit} content={user.displayName} />
            <InputText htmlFor='firstName' type='text' editable editOnClick={edit} content={user.firstName} />
            <InputText htmlFor='lastName' type='text' editable editOnClick={edit} content={user.lastName} />
        </section>
    );
};

export default Profile;
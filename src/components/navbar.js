import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { logoutUser } from '@/redux/actions/auth';

import styles from '@/styles/Navbar.module.css';

const Navbar = () => {
    const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);
    const dispatch = useDispatch();
    const router = useRouter();

    const redirect = (path) => {
        router.push(path);
    };

    return (
        <div className={styles.container}>
            <ul>
                <li className={styles.navItem} onClick={() => redirect('/')}>
                    Home
                </li>
                {!isLoggedIn && (
                    <li className={styles.navItem} onClick={() => redirect('/signin')}>
                        Log In
                    </li>
                )}
                {!isLoggedIn && (
                    <li className={styles.navItem} onClick={() => redirect('/register')}>
                        Sign Up
                    </li>
                )}
                {isLoggedIn && (
                    <li className={styles.navItem} onClick={() => redirect('/users')}>
                        Users
                    </li>
                )}
                {isLoggedIn && (
                    <li className={styles.navItem} onClick={() => redirect('/calendar')}>
                        Calendar
                    </li>
                )}
                {isLoggedIn && (
                    <li
                        className={styles.navItem}
                        onClick={() => {
                            redirect('/');
                            dispatch(logoutUser());
                        }}
                    >
                        Log out
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Navbar;

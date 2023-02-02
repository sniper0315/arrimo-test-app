import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import Head from 'next/head';
import { Button, Divider, Form, Input, message, Typography } from 'antd';

import { LockOutlined, UserOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import { loginUser } from '@/redux/actions/auth';
import styles from '@/styles/Auth.module.css';

const LoginPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (isLoggedIn) {
            router.push('/users');
        }
    }, [isLoggedIn]);

    const checkEmailFormat = (email) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(email);
    };

    const handleSubmit = async (user) => {
        if (user.username === '' || user.password === '') {
            messageApi.error('Please fill all correctly.');

            return;
        }

        if (!checkEmailFormat(user.username)) {
            messageApi.error('Please input Email correctly.');

            return;
        }

        await axios
            .post('/api/auth', user)
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    setCookie('user_token', res.data.token);
                    dispatch(loginUser({ ...user, token: res.data.token }));
                    router.push('/users');
                }
            })
            .catch((err) => {
                if (err.response.status === 401 || err.response.status === 403) messageApi.warning(err.response.data.message);
                else messageApi.error(err.response.data.message);
            });
    };

    return (
        <div className={styles.authContainer}>
            <Head>
                <title>Sign in</title>
            </Head>
            <Form name="normal_login" className={styles.loginForm} initialValues={{ remember: true }} onFinish={handleSubmit}>
                {contextHolder}
                <div className={styles.loginFormTitleSection}>
                    <Typography className={styles.loginFormTitle}>Arrimo</Typography>
                    <Typography className={styles.loginFormWelcome}>Welcome</Typography>
                </div>
                <Form.Item
                    name="username"
                    className={styles.loginFormItemNoMargin}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username or Email!'
                        }
                    ]}
                >
                    <Input className={styles.loginFormInput} placeholder="Username or Email" prefix={<UserOutlined className={styles.icons} />} />
                </Form.Item>
                <Form.Item
                    name="password"
                    className={styles.loginFormItemWithMargin}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!'
                        }
                    ]}
                >
                    <Input.Password
                        className={styles.loginFormInput}
                        prefix={<LockOutlined className={styles.icons} />}
                        placeholder="Password"
                        iconRender={(visible) => (visible ? <EyeOutlined className={styles.icons} /> : <EyeInvisibleOutlined className={styles.icons} />)}
                    />
                </Form.Item>
                <Form.Item className={styles.loginFormItemNoMargin}>
                    <Button className={styles.loginButton} type="primary" htmlType="submit">
                        Log In
                    </Button>
                </Form.Item>
                <Divider className={styles.divider} />
                <Form.Item className={styles.loginSignup}>
                    Don't you have an account?{' '}
                    <span className={styles.loginSignupButton} onClick={() => router.push('/register')}>
                        Sign Up
                    </span>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginPage;

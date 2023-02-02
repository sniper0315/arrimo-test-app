import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, DatePicker, Form, Input, message, Typography } from 'antd';

import { LockOutlined, UserOutlined, EyeOutlined, EyeInvisibleOutlined, MailOutlined } from '@ant-design/icons';

import styles from '@/styles/Auth.module.css';

const RegisterPage = () => {
    const [birth, setBirth] = useState('');
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    const checkEmailFormat = (email) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(email);
    };

    const handleSubmit = async (user) => {
        if (user.username === '' || user.email === '' || user.password === '' || birth === '') {
            messageApi.error('Please fill all correctly.');

            return;
        }

        if (!checkEmailFormat(user.email)) {
            messageApi.error('Please input Email correctly.');

            return;
        }

        await axios
            .put('/api/auth', { ...user, birth: birth })
            .then((res) => {
                if (res.status === 200) {
                    messageApi.success(res.data.message);
                    router.push('/signin');
                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) messageApi.warning(err.response.data.message);
                else messageApi.error(err.response.data.message);
            });
    };

    const handleSelectDate = (date, dateString) => {
        setBirth(dateString);
    };

    return (
        <div className={styles.authContainer}>
            <Head>
                <title>Register</title>
            </Head>
            <Form name="normal_register" className={styles.loginForm} initialValues={{ remember: true }} onFinish={handleSubmit}>
                {contextHolder}
                <div className={styles.loginFormTitleSection}>
                    <Typography className={styles.loginFormTitle}>Arrimo</Typography>
                    <Typography className={styles.loginFormWelcome}>Sign Up</Typography>
                </div>
                <Form.Item
                    name="username"
                    className={styles.loginFormItemNoMargin}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Full Name.'
                        }
                    ]}
                >
                    <Input className={styles.loginFormInput} placeholder="Full Name" prefix={<UserOutlined className={styles.icons} />} />
                </Form.Item>
                <Form.Item
                    name="email"
                    className={styles.loginFormItemNoMargin}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Email.'
                        }
                    ]}
                >
                    <Input className={styles.loginFormInput} placeholder="Email" prefix={<MailOutlined className={styles.icons} />} />
                </Form.Item>
                <Form.Item
                    name="password"
                    className={styles.loginFormItemNoMargin}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password.'
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
                <Form.Item
                    name="birth"
                    className={styles.loginFormItemWithMargin}
                    rules={[
                        {
                            required: true,
                            message: 'Please select your Day of Birth.'
                        }
                    ]}
                >
                    <DatePicker className={styles.registerDatePicker} onChange={handleSelectDate} />
                </Form.Item>
                <Form.Item className={styles.loginFormItemNoMargin}>
                    <Button className={styles.loginButton} type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterPage;

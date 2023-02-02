import { Button, DatePicker, Input, message, Modal, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { UserAddOutlined, LockOutlined, UserOutlined, MailOutlined, CloseOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import styles from '@/styles/Users.module.css';
import Loading from '@/components/loading';

dayjs.extend(customParseFormat);

const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Day of Birth', dataIndex: 'birth' }
];

const Users = () => {
    const [addOpen, setAddOpen] = useState(false);
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        birth: '2000-01-01'
    });
    const [userList, setUserList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleAddUser = async () => {
        if (!checkEmailFormat(user.email)) {
            messageApi.error('Please input Email correctly');

            return;
        }

        await axios
            .put('/api/user', user)
            .then((res) => {
                setAddOpen(false);
                messageApi.success(res.data.message);
                setRefresh(!refresh);
            })
            .catch((err) => {
                console.log(err);
                messageApi.error(err.response.data.message);
            });
    };

    const handleSelectDate = (date, dateString) => {
        setUser({ ...user, birth: dateString });
    };

    const checkEmailFormat = (email) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(email);
    };

    useEffect(async () => {
        setUserList([]);
        setLoading(true);
        await axios
            .get('/api/user')
            .then((res) => {
                setUserList(
                    res.data.map((item, index) => {
                        let newUser = { key: index };

                        newUser = { ...newUser, ...item };

                        return newUser;
                    })
                );
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                messageApi.error(err.response.data.message);
            });
    }, [refresh]);

    return (
        <div className={styles.userPanel}>
            {contextHolder}
            <Head>
                <title>Users</title>
            </Head>
            <Typography className={styles.title}>Users</Typography>
            <div className={styles.add}>
                <Button className={styles.addButton} type="primary" icon={<UserAddOutlined />} onClick={() => setAddOpen(true)}>
                    Add User
                </Button>
            </div>
            {loading ? <Loading height="60vh" /> : <Table columns={columns} dataSource={userList} size="middle" />}
            <Modal title="Add User" centered open={addOpen} onOk={handleAddUser} onCancel={() => setAddOpen(false)} okText="Add" width="348px" closeIcon={<CloseOutlined className={styles.icons} />}>
                <div className={styles.userAddPanel}>
                    <Input placeholder="Name" prefix={<UserOutlined className={styles.icons} />} value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                    <Input placeholder="Email" type="email" prefix={<MailOutlined className={styles.icons} />} value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                    <Input.Password
                        prefix={<LockOutlined className={styles.icons} />}
                        placeholder="Password"
                        iconRender={(visible) => (visible ? <EyeOutlined className={styles.icons} /> : <EyeInvisibleOutlined className={styles.icons} />)}
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                    <DatePicker value={dayjs(user.birth, 'YYYY-MM-DD')} format="YYYY-MM-DD" onChange={handleSelectDate} />
                </div>
            </Modal>
        </div>
    );
};

export default Users;

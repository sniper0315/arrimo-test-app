import { Button, DatePicker, Input, message, Modal, Space, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { UserAddOutlined, LockOutlined, UserOutlined, MailOutlined, CloseOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import styles from '@/styles/Users.module.css';
import Loading from '@/components/loading';

dayjs.extend(customParseFormat);

const Users = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        birth: '2000-01-01'
    });
    const [userList, setUserList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    const columns = [
        { title: 'Name', dataIndex: 'name' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Day of Birth', dataIndex: 'birth' },
        {
            title: 'Action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleEditUser(record)}>Edit</Button>
                    <Button onClick={() => handleDeleteUser(record)}>Delete</Button>
                </Space>
            )
        }
    ];

    const handleEditUser = (record) => {
        setUser(record);
        setModalMode('edit');
        setModalOpen(true);
    };

    const handleDeleteUser = async (record) => {
        await axios
            .delete('/api/user/' + record._id.toString())
            .then((res) => {
                messageApi.success(res.data.message);
                setRefresh(!refresh);
            })
            .catch((err) => {
                messageApi.error(err.response.data.message);
            });
    };

    const handleAcceptEvent = async () => {
        if (!checkEmailFormat(user.email)) {
            messageApi.error('Please input Email correctly');

            return;
        }

        if (modalMode === 'add') {
            await axios
                .post('/api/user', user)
                .then((res) => {
                    setModalOpen(false);
                    messageApi.success(res.data.message);
                    setRefresh(!refresh);
                })
                .catch((err) => {
                    console.log(err);
                    messageApi.error(err.response.data.message);

                    if (err.response.status === 404) router.push('/signin');
                });
        } else {
            await axios
                .put('/api/user/' + user._id.toString(), user)
                .then((res) => {
                    setModalOpen(false);
                    messageApi.success(res.data.message);
                    setRefresh(!refresh);
                })
                .catch((err) => {
                    messageApi.error(err.response.data.message);
                });
        }
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

                if (err.response.status === 404) router.push('/signin');
                else if (err.response.status === 405) router.push('/');
            });
    }, [refresh]);

    console.log('users =>', userList);

    return (
        <div className={styles.userPanel}>
            {contextHolder}
            <Head>
                <title>Users</title>
            </Head>
            <Typography className={styles.title}>Users</Typography>
            <div className={styles.add}>
                <Button className={styles.addButton} type="primary" icon={<UserAddOutlined />} onClick={() => setModalOpen(true)}>
                    Add User
                </Button>
            </div>
            {loading ? <Loading height="60vh" /> : <Table columns={columns} dataSource={userList} size="middle" />}
            <Modal
                title={modalMode === 'add' ? 'Add User' : 'Edit User'}
                centered
                open={modalOpen}
                onOk={handleAcceptEvent}
                onCancel={() => setModalOpen(false)}
                okText={modalMode === 'add' ? 'Add' : 'Update'}
                width="348px"
                closeIcon={<CloseOutlined className={styles.icons} />}
            >
                <div className={styles.userAddPanel}>
                    <Input placeholder="Name" prefix={<UserOutlined className={styles.icons} />} value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                    <Input placeholder="Email" type="email" prefix={<MailOutlined className={styles.icons} />} value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                    {modalMode === 'add' && (
                        <Input.Password
                            prefix={<LockOutlined className={styles.icons} />}
                            placeholder="Password"
                            iconRender={(visible) => (visible ? <EyeOutlined className={styles.icons} /> : <EyeInvisibleOutlined className={styles.icons} />)}
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                        />
                    )}
                    <DatePicker value={dayjs(user.birth, 'YYYY-MM-DD')} format="YYYY-MM-DD" onChange={handleSelectDate} />
                </div>
            </Modal>
        </div>
    );
};

export default Users;

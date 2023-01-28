import { Button, DatePicker, Input, message, Modal, Table, Typography } from "antd";
import React, { useState } from "react";
import Head from "next/head";

import {
  UserAddOutlined,
  LockOutlined,
  UserOutlined,
  MailOutlined,
  CloseOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from "@ant-design/icons";

import styles from "@/styles/Users.module.css";

const columns = [
  { title: "Name", dataIndex: "name" },
  { title: "Email", dataIndex: "email" },
  { title: "Password", dataIndex: "password" },
  { title: "Day of Birth", dataIndex: "birth" },
];

const Users = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birth, setBirth] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const handleAddUser = () => {
    if (!checkEmailFormat(email)) {
      messageApi.error('Please input Email correctly');

      return;
    }

    setAddOpen(false);
  };

  const handleSelectDate = (date, dateString) => {
    setBirth(dateString);
  }

  const checkEmailFormat = (email) => {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  };

  return (
    <div className={styles.userPanel}>
      <Head>
        <title>Users</title>
      </Head>
      <Typography className={styles.title}>Users</Typography>
      <div className={styles.add}>
        <Button
          className={styles.addButton}
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setAddOpen(true)}
        >
          Add User
        </Button>
      </div>
      <Table columns={columns} size="middle" />
      <Modal
        title="Add User"
        centered
        open={addOpen}
        onOk={handleAddUser}
        onCancel={() => setAddOpen(false)}
        okText="Add"
        width="348px"
        closeIcon={<CloseOutlined className={styles.icons} />}
      >
        {contextHolder}
        <div className={styles.userAddPanel}>
          <Input
            placeholder="Name"
            prefix={<UserOutlined className={styles.icons} />}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Name"
            type="email"
            prefix={<MailOutlined className={styles.icons} />}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input.Password
            prefix={<LockOutlined className={styles.icons} />}
            placeholder="Password"
            iconRender={(visible) => (visible ? <EyeOutlined className={styles.icons} /> : <EyeInvisibleOutlined className={styles.icons} />)}
            onChange={(e) => setPassword(e.target.value)}
          />
          <DatePicker onChange={handleSelectDate} />
        </div>
      </Modal>
    </div>
  );
};

export default Users;

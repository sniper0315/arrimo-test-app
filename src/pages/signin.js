import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { setCookie } from "cookies-next";
import Head from "next/head";
import { Button, Form, Input, message, Typography } from "antd";

import { LockOutlined, UserOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

import { loginUser } from "@/redux/actions/auth";
import styles from "@/styles/Auth.module.css";

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/users");
    }
  }, [isLoggedIn]);

  const checkEmailFormat = (email) => {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  };

  const handleSubmit = async (user) => {
    if (!checkEmailFormat(user.username)) {
      messageApi.error('Please input Email correctly.')

      return;
    }

    await axios
      .post("http://localhost:3000/api/auth/", user)
      .then((res) => {
        if (res.status === 200) {
          setCookie("user_token", res.data);
          dispatch(loginUser({...user, token: res.data}));
          router.push("/users");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.loginContainer}>
      <Head>
        <title>Sign in</title>
      </Head>
      <Form
        name="normal_login"
        className={styles.loginForm}
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        {contextHolder}
        <Typography className={styles.loginFormTitle}>Arrimo</Typography>
        <Form.Item
          name="username"
          className={styles.loginFormItemNoMargin}
          rules={[
            {
              required: true,
              message: "Please input your Username or Email!",
            },
          ]}
        >
          <Input
            placeholder="Username or Email"
            prefix={<UserOutlined className={styles.icons} />}
          />
        </Form.Item>
        <Form.Item
          name="password"
          className={styles.loginFormItem}
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className={styles.icons} />}
            placeholder="Password"
            iconRender={(visible) => (visible ? <EyeOutlined className={styles.icons} /> : <EyeInvisibleOutlined className={styles.icons} />)}
          />
        </Form.Item>
        <Form.Item className={styles.loginFormItemNoMargin}>
          <Button
            className={styles.loginButton}
            type="primary"
            htmlType="submit"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default LoginPage;

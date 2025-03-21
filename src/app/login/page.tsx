"use client";

import React from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import axiosInstance from "@/lib/axiosCustom";
import { useAuth } from "@/context/authContext";

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

const Login = () => {
  const { setUser, user } = useAuth();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const data = await axios.post(apiUrl + "auth/login", {
        email: values.email,
        password: values.password,
      });
      localStorage.setItem("accessToken", data?.data?.accessToken);

      const user = await axiosInstance.get("auth/profile");
      setUser(user as any);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          label={null}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;

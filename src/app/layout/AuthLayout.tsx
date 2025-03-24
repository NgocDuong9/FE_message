"use client";
import { useAuth } from "@/context/authContext";
import axiosInstance from "@/lib/axiosCustom";
import { Spin } from "antd";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { Fragment, ReactNode, useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (pathname === "/login" && user) {
      router.push("/");
    } else if (!user) {
      router.push("/login");
    }
  }, [user, pathname, loading]);
  if (loading) {
    return (
      <div className="w-screen  h-screen flex justify-center items-center">
        <Spin size="large"></Spin>
      </div>
    );
  }

  return <Fragment>{children}</Fragment>;
};

export default AuthLayout;

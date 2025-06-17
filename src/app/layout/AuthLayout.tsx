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
    } else if (!user && pathname !== "/login") {
      router.push("/login");
    }
  }, [user, pathname, loading]);
  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
        <Spin size="large"></Spin>
        <p className="text-lg text-gray-600">Đang tải, vui lòng chờ...</p>
      </div>
    );
  }

  return <Fragment>{children}</Fragment>;
};

export default AuthLayout;

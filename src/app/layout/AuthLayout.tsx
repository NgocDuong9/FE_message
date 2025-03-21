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

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/login" && user) {
      router.push("/");
    } else if (!user) {
      router.push("/login");
    }
  }, [user, pathname]);

  if (loading)
    <>
      <Spin tip="Loading" size="large"></Spin>
    </>;
  return <Fragment>{children}</Fragment>;
};

export default AuthLayout;

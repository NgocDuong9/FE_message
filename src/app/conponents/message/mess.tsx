import dayjs from "dayjs";
import React from "react";
import { twMerge } from "tailwind-merge";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";
const Mess = ({
  message,
  time,
  img,
  own = false,
}: {
  message: string;
  time: string;
  img?: string;
  own?: boolean;
}) => {
  const createdAt = dayjs(time).format("HH:mm");

  return (
    <div className={twMerge("flex gap-2 flex-col w-full", own && "items-end")}>
      <div className="flex gap-1 items-center">
        <Avatar
          size="large"
          icon={<UserOutlined />}
          className={twMerge(own && "hidden")}
        />
        <p
          className={twMerge(
            "text-sm text-white text-center h-fit p-2 rounded-lg",
            own ? "bg-[#ffc7c7]" : "bg-[#1877f2]"
          )}
        >
          {message}
        </p>
      </div>
      <p className="text-xs opacity-45">{createdAt}</p>
    </div>
  );
};

export default Mess;

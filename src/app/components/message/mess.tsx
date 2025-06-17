import dayjs from "dayjs";
import React from "react";
import { twMerge } from "tailwind-merge";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";
import { Message } from "@/type/conversation";

const Mess = ({
  message,
  time,
  img,
  own = false,
  hiddenAvatar,
  replyTo,
  handleSelect,
}: {
  message: string;
  time: string;
  img?: string;
  own?: boolean;
  hiddenAvatar: boolean;
  replyTo: string | null;
  handleSelect: () => void;
}) => {
  const createdAt = dayjs(time).format("HH:mm");

  return (
    <div
      className={twMerge(
        "flex gap-2 flex-col w-full",
        own && "items-end",
        hiddenAvatar && " pl-10"
      )}
    >
      <div className="flex gap-1 items-end">
        <Avatar
          size="large"
          icon={<UserOutlined />}
          className={twMerge((own || hiddenAvatar) && "hidden", "size-9")}
        />

        <div className="relative group">
          {replyTo && (
            <p
              className={twMerge(
                "text-xs text-black text-center h-fit p-2  bg-[#c3c2c2a4] -mb-1.5 rounded-tl-xl",
                own ? "rounded-tl-lg" : "rounded-tr-lg"
              )}
            >
              {replyTo}
            </p>
          )}
          <p
            className={twMerge(
              "text-sm text-white text-center h-fit p-2 ",
              own ? "bg-[#ffc7c7] rounded-l-lg" : "bg-[#1877f2] rounded-r-lg"
            )}
          >
            {message}
          </p>
          <div
            className={twMerge(
              "absolute hidden group-hover:block top-1/2 -translate-y-1/2 px-2",
              own ? "-translate-x-full -left-0" : "translate-x-full -right-0"
            )}
          >
            <p
              className="bg-slate-100 rounded-md flex items-center justify-center"
              onClick={handleSelect}
            >
              <i className="ri-reply-line"></i>
            </p>
          </div>
        </div>
      </div>
      <p className={twMerge("text-xs opacity-45 hidden")}>{createdAt}</p>
    </div>
  );
};

export default Mess;

import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";
const SelectFriend = ({ name, image }: { name: string; image?: string }) => {
  return (
    <div className={"flex items-center gap-2"}>
      {/* <img
        src={Boolean(image) ? image : "URL_ADDRESSicsum.photos/200/300"}
        alt=""
        className="rounded-full w-12 h-12 object-cover "
      /> */}

      <Avatar size="large" icon={<UserOutlined />} />
      <p className="font-semibold cursor-pointer">{name}</p>
    </div>
  );
};

export default SelectFriend;

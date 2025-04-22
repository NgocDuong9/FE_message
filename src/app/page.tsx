"use client";

import { useAuth } from "@/context/authContext";
import axiosInstance from "@/lib/axiosCustom";
import { Conversation, Message } from "@/type/conversation";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";
import { useEffect, useState } from "react";
import LeftMessage from "./conponents/message/leftMessage";
import BoxChat from "./conponents/message/boxChat";
import { getMessageById } from "@/api/message";

export default function Home() {
  const { user, loading } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationSelect, setConversationSelect] = useState<Conversation>();

  const getConversations = async (userId: string) => {
    try {
      const data = await axiosInstance.get(`/conversation/${userId}`);
      setConversations(data as Conversation[]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const userId = user?._id;
    if (!userId) return;
    getConversations(userId);
  }, [user]);

  return (
    <div className="p-4 flex gap-4 h-screen">
      <div className="flex w-full ">
        <div className="flex-[2.5] p-5">
          <LeftMessage
            conversation={conversations}
            setConversationSelect={setConversationSelect}
          />
        </div>
        <div className="flex-[5]">
          <BoxChat conversationSelect={conversationSelect} />
        </div>
      </div>
    </div>
  );
}

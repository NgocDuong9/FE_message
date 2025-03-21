"use client";

import { useAuth } from "@/context/authContext";
import axiosInstance from "@/lib/axiosCustom";
import { Conversation } from "@/type/conversation";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);

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
  console.log(conversations);
  return (
    <div>
      {conversations?.map((conversation: Conversation) => {
        const name = conversation.members.find(
          (item) => item._id !== user?._id
        );

        return (
          <div key={conversation._id}>
            <h1>{name?.username}</h1>
          </div>
        );
      })}
    </div>
  );
}

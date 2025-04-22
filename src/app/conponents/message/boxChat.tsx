"use client";
import React, { useEffect, useRef, useState } from "react";
import Mess from "./mess";
import { io, Socket } from "socket.io-client";
import { Conversation, Message } from "@/type/conversation";
import { useAuth } from "@/context/authContext";
import { createMessage } from "@/api/message";
import FormSend from "./formsend";

const BoxChat = ({
  message,
  conversationSelect,
  setMessage,
}: {
  message: Message[] | undefined;
  conversationSelect: Conversation | undefined;
  setMessage: React.Dispatch<React.SetStateAction<Message[] | undefined>>;
}) => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3001/");

      socketRef.current.on("newMessage", (newMessage) => {
        setMessage((prevMessages) => [...(prevMessages ?? []), newMessage]);
      });
    }
    if (conversationSelect?._id && socketRef.current) {
      // console.log("📢 Joining room:", conversationSelect._id);
      socketRef.current.emit("joinRoom", conversationSelect._id);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [conversationSelect?._id]);

  useEffect(() => {
    if (socketRef.current) {
    }
  }, [socketRef.current]);

  const handleSendMessage = async (text: string) => {
    if (!user || !socketRef.current || !conversationSelect) return;

    const messageData = {
      senderId: user._id,
      text: text.trim(),
      conversationId: conversationSelect._id, // ✅ Thêm conversationId
    };

    // console.log("📤 Sending message:", messageData);
    socketRef.current.emit("sendMessage", messageData);

    try {
      const message = await createMessage(messageData);
      // setMessage((prevMessages: any) => [...(prevMessages ?? []), message]);
    } catch (error) {
      console.error(error);
    }
  };

  const name = conversationSelect?.members.find(
    (item) => item._id !== user?._id
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  return (
    <div className="w-full justify-between flex flex-col mt-3 px-2">
      <div>
        <p className="font-medium text-2xl">{name?.username}</p>
        <div className="w-full overflow-y-auto py-5 min-h-[calc(100vh-120px)] max-h-[calc(100vh-170px)] sidebar px-2">
          {message?.map((item, idx) => {
            return (
              <div key={idx} ref={scrollRef}>
                <Mess
                  message={item.text}
                  time={item.createdAt}
                  own={item.senderId === user?._id}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full flex justify-between gap-2 px-2">
        <FormSend handleSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default BoxChat;

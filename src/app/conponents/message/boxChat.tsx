"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { Conversation, IResponseMessage, Message } from "@/type/conversation";
import { useAuth } from "@/context/authContext";
import { createMessage, getMessageById } from "@/api/message";
import { Spin } from "antd";
import { initializeSocket } from "@/lib/socket";
import Mess from "./mess";
import FormSend from "./formsend";
import { useSearchQuery } from "@/hooks/useQueryPage";

const BoxChat: React.FC<{ conversationSelect?: Conversation }> = ({
  conversationSelect,
}) => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] =
    useState<string>("");

  const { params, handleOnPage } = useSearchQuery({});

  // Reset khi đổi cuộc trò chuyện
  useEffect(() => {
    if (!conversationSelect) return;

    if (currentConversationId !== conversationSelect._id) {
      setCurrentConversationId(conversationSelect._id);
      handleOnPage(1);
      setMessages([]);
    }
  }, [conversationSelect]);

  const fetchMessages = useCallback(async () => {
    if (!currentConversationId) return;

    try {
      const container = scrollContainerRef.current;
      const prevScrollHeight = container?.scrollHeight || 0;

      setIsLoading(true);
      const response = (await getMessageById({
        id: currentConversationId,
        params,
      })) as IResponseMessage;

      setTotalPages(response.pagination.totalPages);
      setMessages((prev) =>
        params.page === 1 ? response.messages : [...response.messages, ...prev]
      );

      // Scroll xử lý giữ nguyên vị trí
      requestAnimationFrame(() => {
        if (container) {
          if (params.page > 1) {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - prevScrollHeight;
          } else {
            // Scroll to bottom khi load page 1
            container.scrollTop = container.scrollHeight;
          }
        }
      });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, params]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!user || !socketRef.current || !currentConversationId || !text.trim())
        return;

      const messageData = {
        senderId: user._id,
        text: text.trim(),
        conversationId: currentConversationId,
      };

      socketRef.current.emit("sendMessage", messageData);

      try {
        await createMessage(messageData);
        // Sau khi gửi thì scroll xuống dưới cùng
        requestAnimationFrame(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop =
              scrollContainerRef.current.scrollHeight;
          }
        });
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
    [user, currentConversationId]
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      if (target.scrollTop === 0 && !isLoading && params.page < totalPages) {
        handleOnPage(params.page + 1);
      }
    },
    [isLoading, params.page, totalPages]
  );

  // Kết nối socket
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = initializeSocket();

      socketRef.current.on("newMessage", (newMessage: Message) => {
        setMessages((prev) => [...prev, newMessage]);

        // Auto scroll xuống nếu đang ở page 1
        requestAnimationFrame(() => {
          if (scrollContainerRef.current && params.page === 1) {
            scrollContainerRef.current.scrollTop =
              scrollContainerRef.current.scrollHeight;
          }
        });
      });
    }

    if (currentConversationId && socketRef.current) {
      socketRef.current.emit("joinRoom", currentConversationId);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [currentConversationId]);

  const otherUser = conversationSelect?.members.find(
    (member) => member._id !== user?._id
  );

  return (
    <div className="w-full flex flex-col mt-3 px-2 h-full">
      <header className="mb-4">
        <h2 className="font-medium text-2xl">{otherUser?.username}</h2>
      </header>

      <main className="flex-1 relative ">
        <div
          ref={scrollContainerRef}
          className="w-full overflow-y-auto py-5 min-h-[calc(100vh-170px)] max-h-[calc(100vh-170px)] sidebar px-2"
          onScroll={handleScroll}
        >
          {isLoading && (
            <div className="absolute left-1/2 top-2 -translate-x-1/2">
              <Spin />
            </div>
          )}

          {messages.map((message, idx) => (
            <Mess
              key={message._id || idx}
              message={message.text}
              time={message.createdAt}
              own={message.senderId === user?._id}
            />
          ))}
        </div>
      </main>

      <footer className="mt-4">
        <FormSend handleSendMessage={handleSendMessage} />
      </footer>
    </div>
  );
};

export default React.memo(BoxChat);

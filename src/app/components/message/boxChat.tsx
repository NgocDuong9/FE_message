'use client';
import { createMessage, getMessageById, updateMessage } from '@/api/message';
import { useAuth } from '@/context/authContext';
import { useSearchQuery } from '@/hooks/useQueryPage';
import { initializeSocket } from '@/lib/socket';
import { Conversation, Message } from '@/type/conversation';
import { Spin } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import FormSend from './formsend';
import Mess from './mess';

const BoxChat: React.FC<{ conversationSelect?: Conversation }> = ({ conversationSelect }) => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageSelect, setMessageSelect] = useState<{
    mess: Message;
    type: 'reply' | 'edit' | 'delete' | 'select' | 'none' | undefined;
  }>();

  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');

  const { params, handleOnPage } = useSearchQuery({});

  // Reset khi đổi cuộc trò chuyện
  useEffect(() => {
    if (!conversationSelect) return;

    if (currentConversationId !== conversationSelect._id) {
      setCurrentConversationId(conversationSelect._id);
      setTotalPages(1);
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
      const response = await getMessageById({
        id: currentConversationId,
        params,
      });

      setTotalPages(response.pagination.totalPages);

      setMessages(prev =>
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
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, params.page]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!user || !socketRef.current || !currentConversationId || !text.trim()) return;

      const messageData = {
        senderId: user._id,
        text: text.trim(),
        conversationId: currentConversationId,
        replyTo:
          messageSelect?.type === 'reply'
            ? {
                text: messageSelect?.mess.text,
                _id: messageSelect?.mess._id,
              }
            : undefined,
      };

      socketRef.current.emit('sendMessage', messageData);
      try {
        await createMessage(messageData);
        requestAnimationFrame(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
          }
        });

        setMessageSelect(undefined);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    },
    [user, currentConversationId, messageSelect]
  );

  const handleUpdateMessage = useCallback(
    async (
      messageId: string,
      emoji: {
        emoji: string;
        senderId?: string;
      },
      type: string
    ) => {
      if (!user || !socketRef.current || !currentConversationId) return;

      const updatedMessage = {
        ...messageSelect?.mess,
        _id: messageId,
        emoji: emoji,
        conversationId: currentConversationId,
      };

      socketRef.current.emit('updateMessage', updatedMessage);
      try {
        const newMessage = await updateMessage({
          conversationId: currentConversationId,
          id: messageSelect?.mess._id || '',
          emoji,
          type,
        });

        // Cập nhật tin nhắn trong state

        setMessages(prev =>
          prev.map(mess => (mess._id === messageId ? (newMessage as any) : mess))
        );
      } catch (error) {
        console.error('Failed to update message:', error);
      }
    },
    [user, currentConversationId, messageSelect]
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      if (target.scrollTop === 0 && !isLoading && params.page < totalPages) {
        setTimeout(() => {
          if (!isLoading && params.page < totalPages) {
            handleOnPage(params.page + 1);
          }
        }, 300);
      }
    },
    [isLoading, params.page, totalPages]
  );

  // Kết nối socket
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = initializeSocket();

      socketRef.current.on('newMessage', (newMessage: Message) => {
        setMessages(prev => [...prev, newMessage]);

        // Auto scroll xuống nếu đang ở page 1
        requestAnimationFrame(() => {
          if (scrollContainerRef.current && params.page === 1) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
          }
        });
      });

      socketRef.current.on('messageUpdated', (updatedMessage: any) => {
        setMessages(prevMessages =>
          prevMessages.map(message => {
            if (message._id !== updatedMessage._id) return message;

            // Đảm bảo emoji là array
            const existingEmojiList = Array.isArray(message.emoji) ? message.emoji : [];

            const incomingEmoji = updatedMessage.emoji;

            if (!incomingEmoji || !incomingEmoji.senderId) {
              return message; // không có emoji mới thì bỏ qua
            }

            const existingIndex = existingEmojiList.findIndex(
              e => e.senderId === incomingEmoji.senderId
            );

            let newEmojiList;
            if (existingIndex !== -1) {
              // Nếu đã có sender => cập nhật emoji
              newEmojiList = existingEmojiList.map(e =>
                e.senderId === incomingEmoji.senderId ? incomingEmoji : e
              );
            } else {
              // Thêm mới
              newEmojiList = [...existingEmojiList, incomingEmoji];
            }

            return {
              ...message,
              emoji: newEmojiList,
            };
          })
        );
      });

      socketRef.current.on('error', error => {
        console?.log('Socket error:', error);
        setTimeout(() => {
          if (socketRef.current) {
            socketRef.current.connect();
          }
        }, 5000);
      });
    }

    if (currentConversationId && socketRef.current) {
      socketRef.current.emit('joinRoom', currentConversationId);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [currentConversationId]);

  const otherUser = conversationSelect?.members.find(member => member._id !== user?._id);

  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col mt-3 px-2 h-full">
      <header className="mb-4">
        <h2 className="font-medium text-2xl">{otherUser?.username}</h2>
      </header>

      <main className="flex-1 relative ">
        <div
          className="w-full overflow-y-auto min-h-[calc(100vh-160px)] max-h-[calc(100vh-160px)] sidebar px-2 custom-scrollbar"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {isLoading && (
            <div className="absolute left-1/2 top-2 -translate-x-1/2 flex flex-col items-center">
              <Spin />
              <p className="text-sm text-gray-600 mt-2">Đang tải tin nhắn...</p>
            </div>
          )}

          <div className="flex flex-col gap-0.5">
            {messages.map((message, idx) => {
              const hiddenAvatar = messages[idx + 1]?.senderId === message.senderId;

              const handleSelect = (
                type: 'reply' | 'edit' | 'delete' | 'select' | 'none' | undefined
              ) => {
                setMessageSelect({ mess: message, type });
              };

              const isShowEmojiPicker = messageSelect?.mess._id === message._id;
              return (
                <Mess
                  key={idx}
                  text={message.text}
                  time={message.createdAt}
                  own={message.senderId === user?._id}
                  hiddenAvatar={hiddenAvatar}
                  replyTo={message.replyTo?.text}
                  handleSelect={handleSelect}
                  showEmojiPicker={showEmojiPicker}
                  message={message}
                  setShowEmojiPicker={setShowEmojiPicker}
                  isShowEmojiPicker={isShowEmojiPicker}
                  handleUpdateMessage={handleUpdateMessage}
                />
              );
            })}
          </div>
        </div>
      </main>

      <footer className="mt-4 relative" onClick={() => setShowEmojiPicker(false)}>
        {messageSelect?.type === 'reply' && (
          <div className="flex gap-2 absolute -top-6 left-0 w-full">
            <p className="text-xs border-t border-l border-r rounded-t-lg text-start h-fit px-2 pt-1 pb-4 round-t w-full">
              {messageSelect?.mess?.text}
            </p>
            <p
              className="flex items-center justify-center absolute right-0"
              onClick={() => setMessageSelect(undefined)}
            >
              <i className="ri-close-line"></i>
            </p>
          </div>
        )}
        <FormSend handleSendMessage={handleSendMessage} />
      </footer>
    </div>
  );
};

export default React.memo(BoxChat);

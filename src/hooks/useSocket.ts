import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { initializeSocket } from "@/lib/socket";

export const useSocket = (conversationId?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = initializeSocket();
    }

    if (conversationId && socketRef.current) {
      socketRef.current.emit("joinRoom", conversationId);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [conversationId]);

  return socketRef.current;
};

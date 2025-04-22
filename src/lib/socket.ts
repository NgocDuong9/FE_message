import { io } from "socket.io-client";

export const initializeSocket = () => {
  return io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001");
};

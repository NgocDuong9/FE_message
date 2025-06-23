export interface Member {
  _id: string;
  username: string;
}

export interface Conversation {
  _id: string;
  members: Member[];
  nickname: string[];
  __v: number;
}
export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  emoji: {
    emoji: string;
    senderId?: string;
  }[];
  replyTo: {
    text: string;
  };
  __v: number;
}

export interface IParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IResponseMessage {
  messages: Message[];
  pagination: IParams;
}

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
  __v: number;
}

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

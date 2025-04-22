import { IParams } from "@/hooks/useQueryPage";
import axiosInstance from "@/lib/axiosCustom";
import { IResponseMessage } from "@/type/conversation";

export const getAllConversation = async (data: { userId: string }) => {
  const all = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/conversation/${data.userId}`
  );

  return all;
};

export const getMessageById = async (data: { id: string; params: IParams }) => {
  const all = await axiosInstance.get<IResponseMessage>(
    `${process.env.NEXT_PUBLIC_API_URL}message/${data.id}?page=${data.params.page}`
  );

  return all;
};

export const createMessage = async (data: {
  senderId: string;
  conversationId: string;
  text: string;
}) => {
  const all = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}message`,
    {
      ...data,
    }
  );

  return all;
};

import axiosInstance from "@/lib/axiosCustom";

export const getAllConversation = async (data: { userId: string }) => {
  const all = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/conversation/${data.userId}`
  );

  return all;
};

export const getMessageById = async (data: { id: string }) => {
  const all = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}message/${data.id}`
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

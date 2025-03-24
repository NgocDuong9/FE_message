import axios from "axios";

export const postNew = async (data: {
  userId: string;
  desc: string;
  img?: string;
}) => {
  const post = await axios.post(`${process.env.REACT_APP_PUBLIC_URL}/post`, {
    ...data,
  });

  return post.data;
};

export const getAllPost = async (data: { userId: string }) => {
  const allPost = await axios.get(
    `${process.env.REACT_APP_PUBLIC_URL}/post/timeline/all/${data.userId}`
  );

  return allPost.data;
};

export const likePost = async (data: { id: string; userId: string }) => {
  const allPost = await axios.put(
    `${process.env.REACT_APP_PUBLIC_URL}/post/like/${data.id}`,
    {
      userId: data.userId,
    }
  );

  return allPost.data;
};

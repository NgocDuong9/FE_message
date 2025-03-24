import axios from "axios";

export const fetchProfile = async (data: { userId: string }) => {
  const profile = await axios.get(
    `${process.env.REACT_APP_PUBLIC_URL}/users/${data.userId}`
  );
  console.log(profile.data, "xxxx");

  return profile.data;
};

export const handleFollow = async (data: { userId: string; id: string }) => {
  const profile = await axios.put(
    `${process.env.REACT_APP_PUBLIC_URL}/users/follow/${data.id}`,
    {
      userId: data.userId,
    }
  );
  return profile.data;
};

export const handleUnfollow = async (data: { userId: string; id: string }) => {
  const profile = await axios.put(
    `${process.env.REACT_APP_PUBLIC_URL}/users/unfollow/${data.id}`,
    {
      userId: data.userId,
    }
  );
  return profile.data;
};

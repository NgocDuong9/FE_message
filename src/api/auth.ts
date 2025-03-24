import axios from "axios";

export const register = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const register = await axios.post(
    `${process.env.REACT_APP_PUBLIC_URL}/auth/register`,
    {
      ...data,
    }
  );

  return register.data;
};

export const login = async (data: { email: string; password: string }) => {
  const login = await axios.post(
    `${process.env.REACT_APP_PUBLIC_URL}/auth/login`,
    {
      ...data,
    }
  );
  return login.data;
};

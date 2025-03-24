"use client";
import axiosInstance from "@/lib/axiosCustom";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  _id: string;
  username: string;
  password: string;
  email: string;
  followers: string[];
  followings: string[];
  blocked: string[];
  __v: number;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  theme: string;
  setTheme: (theme: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const initValue = {
  user: null,
  setUser: (user: User | null) => {},
  theme: "light",
  setTheme: (theme: string) => {},
  loading: false,
  setLoading: (loading: boolean) => {},
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<string>("light");
  const [loading, setLoading] = useState<boolean>(true);
  let accesToken = "";
  if (typeof window !== "undefined") {
    accesToken = localStorage.getItem("accessToken") ?? "";
  }

  const getProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/auth/profile");
      setUser(response as any);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accesToken && !user) {
      getProfile();
      return;
    } else {
      setLoading(false);
    }
  }, [user, accesToken]);

  return (
    <AppContext.Provider
      value={{ user, setUser, theme, setTheme, loading, setLoading }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AppContext);
  if (!context) {
    return initValue;
  }
  return context;
};

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const UserContext = createContext(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "{}") {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
        }
      }
    }
  }, []);

  if (!isClient) {
    return <UserContext.Provider value={null}>{children}</UserContext.Provider>;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const UserContext = createContext(null);

interface UserProviderProps {
  children: ReactNode; // এখানে children-এর টাইপ ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);

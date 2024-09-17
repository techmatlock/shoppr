import { getShopper, getUsers, readToken, readUser, removeAuth, saveAuth, Shopper, User } from "@/lib/data";
import { createContext, ReactNode, useEffect, useState } from "react";

export type UserContextValues = {
  user: User | undefined;
  users: User[] | undefined;
  token: string | undefined;
  shopper: Shopper | undefined;
  handleSignIn: (user: User, token: string) => void;
  handleSignOut: () => void;
  getInitials: (name: string) => string;
  fetchShopper: () => void;
};

export const UserContext = createContext<UserContextValues>({
  user: undefined,
  users: undefined,
  token: undefined,
  shopper: undefined,
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
  getInitials: () => "",
  fetchShopper: () => undefined,
});

type Props = {
  children: ReactNode;
};

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User>(); // Specifies only the user that's logged in
  const [users, setUsers] = useState<User[]>([]);
  const [shopper, setShopper] = useState<Shopper>();
  const [token, setToken] = useState<string>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    setUser(readUser());
    setToken(readToken());
  }, []);

  useEffect(() => {
    async function loadShopper() {
      try {
        const data = await getShopper();
        setShopper(data);
      } catch (error) {
        setError(error);
      }
    }
    loadShopper();
  }, []);

  useEffect(() => {
    async function getAllUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        setError(error);
      }
    }
    getAllUsers();
  }, []);

  function handleSignIn(user: User, token: string) {
    setUser(user);
    setToken(token);
    saveAuth(user, token);
  }

  function handleSignOut() {
    setUser(undefined);
    setToken(undefined);
    removeAuth();
  }

  function getInitials(name: string): string {
    if (!name) return "";
    const words = name.split(" ");
    if (words && words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else {
      return words[0][0].toUpperCase() || "";
    }
  }

  async function fetchShopper() {
    try {
      const data = await getShopper();
      setShopper(data);
    } catch (error) {
      setError(error);
    }
  }

  if (error) {
    return <div>Error! {error instanceof Error ? error.message : "Unknown error"}</div>;
  }

  const contextValue = { user, users, token, shopper, handleSignIn, handleSignOut, getInitials, fetchShopper };
  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

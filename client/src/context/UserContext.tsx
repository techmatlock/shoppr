import { readToken, readUser, removeAuth, saveAuth } from "@/lib/data";
import { createContext, ReactNode, useEffect, useState } from "react";

export type User = {
  userId: number;
  name: string;
  username: string;
};

export type UserContextValues = {
  user: User | undefined;
  token: string | undefined;
  handleSignIn: (user: User, token: string) => void;
  handleSignOut: () => void;
  getInitials: (user: { name: string }) => void;
};

export const UserContext = createContext<UserContextValues>({
  user: undefined,
  token: undefined,
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
  getInitials: () => undefined,
});

type Props = {
  children: ReactNode;
};

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    setUser(readUser());
    setToken(readToken());
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

  function getInitials(user: { name: string }): string {
    if (!user || !user.name) return "";
    const words = user?.name?.split(" ");
    if (words && words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else {
      return words[0][0].toUpperCase() || "";
    }
  }

  const contextValue = { user, token, handleSignIn, handleSignOut, getInitials };
  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

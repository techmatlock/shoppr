import { apiUrl, readToken, readUser, removeAuth, saveAuth, Shopper, User } from "@/lib/data";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export type UserContextValues = {
  user: User | undefined;
  users: User[] | undefined;
  token: string | undefined;
  shopper: Shopper | undefined;
  handleSignIn: (user: User, token: string) => void;
  handleSignOut: () => void;
  fetchShopper: () => void;
};

export const UserContext = createContext<UserContextValues>({
  user: undefined,
  users: undefined,
  token: undefined,
  shopper: undefined,
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
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
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    setUser(readUser());
    setToken(readToken());
    if (isAuthenticated) {
      setUser(readUser());
      setToken(readToken());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setUser(readUser());
    setToken(readToken());
    if (isAuthenticated) {
      async function loadShopper() {
        try {
          const data = await getShopper();
          setShopper(data);
        } catch (error) {
          setError(error);
        }
      }
      loadShopper();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setUser(readUser());
    setToken(readToken());
    if (isAuthenticated) {
      async function getAllUsers() {
        try {
          const data = await getUsers();
          setUsers(data);
        } catch (error) {
          setError(error);
        }
      }
      getAllUsers();
    }
  }, [isAuthenticated]);

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

  async function fetchShopper() {
    try {
      const data = await getShopper();
      setShopper(data);
    } catch (error) {
      setError(error);
    }
  }

  async function getShopper(): Promise<Shopper> {
    const res = await fetch(`${apiUrl}/api/shopper`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error(`Response status: ${res.status}`);
    return (await res.json()) as Shopper;
  }

  async function getUsers(): Promise<User[]> {
    const res = await fetch(`${apiUrl}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error(`Response status: ${res.status}`);
    return (await res.json()) as User[];
  }

  if (error) {
    return <div>Error! {error instanceof Error ? error.message : "Unknown error"}</div>;
  }

  const contextValue = { user, users, token, shopper, handleSignIn, handleSignOut, fetchShopper };
  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

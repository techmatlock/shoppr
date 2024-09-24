import { apiUrl, NeededBy, ShoppingItems } from "@/lib/data";
import { ReactNode, useState, createContext, useEffect } from "react";
import { useUser } from "./useUser";

export type ItemsContextValues = {
  items: ShoppingItems[] | undefined;
  neededBy: NeededBy[] | undefined;
  getItems: () => void;
  fetchItems: () => void;
  removeNeededBy: (itemId: number, shoppingItemId: number) => void;
  addNeededBy: (userId: number, shoppingItemId: number) => void;
};

export const ItemsContext = createContext<ItemsContextValues>({
  items: undefined,
  neededBy: undefined,
  getItems: () => undefined,
  fetchItems: () => undefined,
  removeNeededBy: () => undefined,
  addNeededBy: () => undefined,
});

type Props = {
  children: ReactNode;
};

export function ItemsProvider({ children }: Props) {
  const [items, setItems] = useState<ShoppingItems[]>([]);
  const [neededBy, setNeededBy] = useState<NeededBy[]>([]);
  const { token } = useUser();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getItems();
        setItems(data);
      } catch (error) {
        setError(error);
      }
    }
    loadPosts();
  }, []);

  useEffect(() => {
    async function loadNeededBy() {
      try {
        const data = await getNeededBy();
        setNeededBy(data);
      } catch (error) {
        setError(error);
      }
    }
    loadNeededBy();
  }, []);

  async function fetchItems() {
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      setError(error);
    }
  }

  // Adds user that clicked on need item to the neededBy table
  async function addNeededBy(userId: number, shoppingItemId: number) {
    try {
      const existingNeed = await checkIfNeedExists(userId, shoppingItemId);
      if (existingNeed) {
        await removeNeededBy(userId, shoppingItemId);
        return;
      }
      const res = await fetch(`${apiUrl}/api/neededBy/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, shoppingItemId }),
      });
      if (!res.ok) throw new Error(`Response status: ${res.status}`);
      const data = (await res.json()) as NeededBy[];
      setNeededBy(data);
    } catch (error) {
      setError(error);
    }
  }

  async function removeNeededBy(userId: number, shoppingItemId: number) {
    try {
      const res = await fetch(`${apiUrl}/api/neededBy/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, shoppingItemId }),
      });
      if (!res.ok) throw new Error(`Response status: ${res.status}`);
      const data = (await res.json()) as NeededBy[];
      setNeededBy(data);
    } catch (error) {
      setError(error);
    }
  }

  async function getItems(): Promise<ShoppingItems[]> {
    const res = await fetch(`${apiUrl}/api/shoppingItems`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error(`Response status: ${res.status}`);
    return (await res.json()) as ShoppingItems[];
  }

  // Get users that requested they need the shopping item
  async function getNeededBy(): Promise<NeededBy[]> {
    const res = await fetch(`${apiUrl}/api/neededBy`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error(`Response status: ${res.status}`);
    return (await res.json()) as NeededBy[];
  }

  async function checkIfNeedExists(userId: number, shoppingItemId: number) {
    try {
      const total: NeededBy[] = [];
      neededBy.forEach((need) => {
        if (need.userId === userId && need.shoppingItemId == shoppingItemId) {
          total.push(need);
        }
      });
      if (total.length >= 1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      setError(error);
    }
  }

  if (error) {
    return <div>Error! {error instanceof Error ? error.message : "Unknown error"}</div>;
  }

  const contextValue = {
    items,
    neededBy,
    getItems,
    fetchItems,
    removeNeededBy,
    addNeededBy,
  };

  return <ItemsContext.Provider value={contextValue}>{children}</ItemsContext.Provider>;
}

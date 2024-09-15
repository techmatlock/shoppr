import { getItems, getNeededBy, NeededBy, ShoppingItems } from "@/lib/data";
import { ReactNode, useState, createContext, useEffect } from "react";

export type ItemsContextValues = {
  items: ShoppingItems[] | undefined;
  neededBy: NeededBy[] | undefined;
  getItems: () => void;
  fetchItems: () => void;
};

export const ItemsContext = createContext<ItemsContextValues>({
  items: undefined,
  neededBy: undefined,
  getItems: () => undefined,
  fetchItems: () => undefined,
});

type Props = {
  children: ReactNode;
};

export function ItemsProvider({ children }: Props) {
  const [items, setItems] = useState<ShoppingItems[]>([]);
  const [neededBy, setNeededBy] = useState<NeededBy[]>([]);
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
        const needed = await getNeededBy();
        setNeededBy(needed);
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

  if (error) {
    return <div>Error! {error instanceof Error ? error.message : "Unknown error"}</div>;
  }

  const contextValue = {
    items,
    neededBy,
    getItems,
    fetchItems,
  };

  return <ItemsContext.Provider value={contextValue}>{children}</ItemsContext.Provider>;
}

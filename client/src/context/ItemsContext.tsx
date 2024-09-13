import { getItems, ShoppingItems } from "@/lib/data";
import { ReactNode, useState, createContext, useEffect } from "react";

export type ItemsContextValues = {
  items: ShoppingItems[] | undefined;
  getItems: () => void;
};

export const ItemsContext = createContext<ItemsContextValues>({
  items: undefined,
  getItems: () => undefined,
});

type Props = {
  children: ReactNode;
};

export function ItemsProvider({ children }: Props) {
  const [items, setItems] = useState<ShoppingItems[]>([]);
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
  }, [items]);

  if (error) {
    return <div>Error! {error instanceof Error ? error.message : "Unknown error"}</div>;
  }

  const contextValue = {
    items,
    getItems,
  };

  return <ItemsContext.Provider value={contextValue}>{children}</ItemsContext.Provider>;
}

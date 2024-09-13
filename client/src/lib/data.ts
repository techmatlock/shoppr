export type ShoppingItems = {
  shoppingItemId: number;
  title: string;
  status: string;
  userId: number;
  groupId: number;
};

export async function getItems(): Promise<ShoppingItems[]> {
  const res = await fetch("/api/shoppingItems", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Response status: ${res.status}`);
  return (await res.json()) as ShoppingItems[];
}

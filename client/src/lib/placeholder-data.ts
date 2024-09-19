type List = {
  title: string;
  status: string;
  shoppingItemId: number;
};

export const shoppingList: List[] = [
  { shoppingItemId: 1, title: "Milk", status: "pending" },
  { shoppingItemId: 2, title: "Eggs", status: "pending" },
  { shoppingItemId: 3, title: "Bread", status: "pending" },
  { shoppingItemId: 4, title: "Butter", status: "pending" },
];

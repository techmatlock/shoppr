type List = {
  title: string;
  status: string;
  shoppingItemId: number;
};

export const shoppingList: List[] = [
  { shoppingItemId: 1, title: "Milk", status: "pending" },
  { shoppingItemId: 2, title: "Eggs", status: "completed" },
  { shoppingItemId: 3, title: "Bread", status: "pending" },
  { shoppingItemId: 4, title: "Butter", status: "pending" },
  { shoppingItemId: 5, title: "Cheese", status: "completed" },
  { shoppingItemId: 6, title: "Chicken", status: "pending" },
  { shoppingItemId: 7, title: "Apples", status: "pending" },
  { shoppingItemId: 8, title: "Tomatoes", status: "completed" },
];

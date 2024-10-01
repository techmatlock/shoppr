export interface Users {
  userId: number;
  name: string;
  username: string;
  hashedPassword: string;
}

export interface ShoppingItemWithUser {
  shoppingItemId: number;
  title: string;
  status: string;
  userId: number;
  name: string;
  username: string;
  groupId: number;
}

export interface Message {
  userId: number;
  message: string;
  timestamp: string;
}

export interface Shopper {
  userId: number;
}

export interface NeededBy {
  userId: number;
  shoppingItemId: number;
}

export type ShoppingItemWithUser = {
  shoppingItemId: number;
  title: string;
  status: string;
  userId: number;
  name: string;
  username: string;
  groupId: number;
};

export type User = {
  userId: number;
  name: string;
  username: string;
};

export type NeededBy = {
  userId: number;
  shoppingItemId: number;
};

export type Shopper = {
  shopperId: number;
  userId: number;
};

export type Message = {
  userId: number;
  message: string;
  timestamp: string;
};

export const authKey = "um.auth";

type Auth = {
  user: User;
  token: string;
};

export const apiUrl = "https://p6q481zlid.execute-api.us-east-1.amazonaws.com";

export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}

export function getInitials(name: string): string {
  if (!name) return "";
  const words = name.split(" ");
  if (words && words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  } else {
    return words[0][0].toUpperCase() || "";
  }
}

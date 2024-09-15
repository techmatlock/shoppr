export type ShoppingItems = {
  shoppingItemId: number;
  title: string;
  status: string;
  userId: number;
  name: string;
  username: string;
  groupId: number;
};

export type NeededBy = {
  userId: number;
  shoppingItemId: number;
};

export type User = {
  userId: number;
  name: string;
  username: string;
};

const authKey = "um.auth";

type Auth = {
  user: User;
  token: string;
};

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

export async function getItems(): Promise<ShoppingItems[]> {
  const res = await fetch("/api/shoppingItems", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Response status: ${res.status}`);
  return (await res.json()) as ShoppingItems[];
}

// Get users that requested they need the shopping item
export async function getNeededBy(): Promise<NeededBy[]> {
  const res = await fetch("/api/neededBy", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Response status: ${res.status}`);
  return (await res.json()) as NeededBy[];
}

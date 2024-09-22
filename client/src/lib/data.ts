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
  name: string;
  shoppingItemId: number;
};

export type User = {
  userId: number;
  name: string;
  username: string;
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

const authKey = "um.auth";

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

export async function getItems(): Promise<ShoppingItems[]> {
  const res = await fetch(`${apiUrl}/api/shoppingItems`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Response status: ${res.status}`);
  return (await res.json()) as ShoppingItems[];
}

// Get users that requested they need the shopping item
export async function getNeededBy(): Promise<NeededBy[]> {
  const res = await fetch(`${apiUrl}/api/neededBy`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Response status: ${res.status}`);
  return (await res.json()) as NeededBy[];
}

export async function getShopper(): Promise<Shopper> {
  const res = await fetch(`${apiUrl}/api/shopper`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Response status: ${res.status}`);
  return (await res.json()) as Shopper;
}

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${apiUrl}/api/users`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Response status: ${res.status}`);
  return (await res.json()) as User[];
}

export async function fetchMessages(): Promise<Message[]> {
  const res = await fetch(`${apiUrl}/api/messages`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Response status: ${res.status}`);
  return (await res.json()) as Message[];
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

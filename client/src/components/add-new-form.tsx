import { useItems } from "@/context/useItems";
import { useUser } from "@/context/useUser";
import { useMutation } from "@tanstack/react-query";
import { FormEvent } from "react";

export function AddNewForm() {
  const { fetchItems } = useItems();
  const { user, token } = useUser();
  const mutation = useMutation({
    mutationFn: async (shoppingItem: string) => {
      const newPost = {
        title: shoppingItem,
        status: "pending",
        userId: user?.userId,
      };
      const req = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      };
      const res = await fetch("/api/shoppingItems", req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
    },
    onSuccess: () => {
      fetchItems();
    },
    onError: (err: Error) => {
      alert(`Failed to create shopping item: ${err.message}`);
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("shoppingItem") as HTMLInputElement;
    mutation.mutate(input.value);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
      <input type="text" name="shoppingItem" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 " placeholder="Add New" required />
      <button className="h-10 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap bg-blue-500 hover:bg-blue-700 text-slate-50 dark:bg-slate-50 dark:text-slate-900" type="submit">
        Add New
      </button>
    </form>
  );
}

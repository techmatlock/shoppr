import { useMutation } from "@tanstack/react-query";
import { useUser } from "../context/useUser";
import { apiUrl, getInitials } from "../lib/data";

export function SideBar() {
  const { shopper, user, token, users, fetchShopper } = useUser();

  const existingShopper = users?.find((u) => u.userId === shopper?.userId);
  const isShopperLoggedIn = user?.userId === shopper?.userId;

  const mutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: number; action: string }) => {
      const req = {
        method: action === "remove" ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      };
      const res = await fetch(`${apiUrl}/api/shopper`, req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
    },
    onSuccess: () => {
      fetchShopper();
    },
    onError: (err: Error) => {
      alert(`Failed to remove you as the current shopper: ${err.message}`);
    },
  });

  // Either assigns or unassigns a user as the current shopper
  function handleAction(userId: number, action: string) {
    mutation.mutate({ userId, action });
  }

  return (
    <>
      <div className="flex items-center justify-center flex-col">
        <p className="font-medium text-xl">Current ShoppR</p>
        {existingShopper && ( // If existing shopper, let others know someone is already with user info in sidebar
          <>
            <div className="relative flex justify-center items-center w-10 h-10 overflow-hidden my-2 bg-green-300 rounded-full dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300">{getInitials(existingShopper.name)}</span>
            </div>
            <div>
              <div className="font-medium">{existingShopper.name}</div>
            </div>
          </>
        )}
        {existingShopper &&
          isShopperLoggedIn && ( // If current logged in user matches current shopper, they have an unassign button
            <button onClick={() => handleAction(existingShopper.userId, "remove")} className="h-10 px-2 py-2 mt-4 rounded-md text-sm font-medium whitespace-nowrap bg-red-500 hover:bg-red-700 text-slate-50 dark:bg-slate-50 dark:text-slate-900" type="submit">
              Unassign Me
            </button>
          )}
        {!existingShopper &&
          user && ( // If current logged in user and no assigned shopper, they have an assign button
            <button onClick={() => handleAction(user.userId, "add")} className="h-10 px-2 py-2 mt-4 rounded-md text-sm font-medium whitespace-nowrap bg-green-500 hover:bg-green-700 text-slate-50 dark:bg-slate-50 dark:text-slate-900" type="submit">
              Assign Me
            </button>
          )}
      </div>
    </>
  );
}

import { useItems } from "@/context/useItems.tsx";
import { useUser } from "@/context/useUser";
import { getInitials } from "@/lib/data";
import { useMutation } from "@tanstack/react-query";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";

type Props = {
  isMobile: boolean;
};

export function ShoppingList({ isMobile }: Props) {
  const { items, neededBy, removeNeededBy, addNeededBy, fetchItems } = useItems();
  const { user, token, users, shopper } = useUser();

  const existingShopper = users?.find((u) => u.userId === shopper?.userId);
  const isShopperLoggedIn = user?.userId === shopper?.userId;

  const mutation = useMutation({
    mutationFn: async (shoppingItemId: number) => {
      const req = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const res = await fetch(`/api/shoppingItems/${shoppingItemId}`, req);
      if (!res.ok) {
        throw new Error(`fetch Error: ${res.status}`);
      }
    },
    onSuccess: () => {
      fetchItems();
    },
    onError: (err: Error) => {
      alert(`Failed to remove the shopping item: ${err.message}`);
    },
  });

  function handleClick(shoppingItemId: number) {
    mutation.mutate(shoppingItemId);
  }

  return (
    <>
      <h1 className="text-lg font-medium my-2">On Hold</h1>
      <div className="grid grid-cols-1 grid-flow-col md:grid-cols-4 items-center gap-8 my-6">
        {isMobile && (
          <>
            <p>Item</p>
            <p>Status</p>
          </>
        )}
        {!isMobile && (
          <>
            <p>Item</p>
            <p>Status</p>
            <p>Needed By</p>
          </>
        )}
      </div>
      <ul>
        {user &&
          items
            ?.filter((item) => item.status === "pending")
            .map((item) => (
              <li key={item.shoppingItemId} className="grid grid-cols-1 grid-flow-col md:grid-cols-4 items-center my-6 border-b-2">
                <div>{item.title}</div>
                <div>
                  <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-green-400 text-white dark:bg-blue-500">{item.status}</span>
                </div>
                {!isMobile && (
                  <div className="flex -space-x-2 rtl:space-x-reverse mx-8">
                    <div className="relative flex justify-center items-center w-10 h-10 overflow-hidden bg-blue-300 rounded-full dark:bg-gray-600">
                      <span className="font-medium text-gray-600 dark:text-gray-300">{getInitials(item.name)}</span>{" "}
                    </div>
                    {neededBy
                      ?.filter((needed) => item.shoppingItemId === needed.shoppingItemId)
                      .map((needed, index) => (
                        <div key={index} className="relative flex justify-center items-center w-10 h-10 overflow-hidden bg-green-300 rounded-full dark:bg-gray-600">
                          <span className="font-medium text-gray-600 dark:text-gray-300">{getInitials(needed.name)}</span>
                        </div>
                      ))}
                  </div>
                )}
                {!isMobile && item.userId !== user.userId && (
                  <div className="flex items-center justify-center space-x-2">
                    {neededBy && neededBy.some((needed) => needed.shoppingItemId === item.shoppingItemId) && (
                      <button>
                        <FaRegTrashAlt onClick={() => removeNeededBy(user.userId, item.shoppingItemId)} className="text-2xl text-red-400" />
                      </button>
                    )}
                    {!isMobile && neededBy && !neededBy.some((needed) => needed.shoppingItemId === item.shoppingItemId) && (
                      <button>
                        <IoMdAddCircleOutline onClick={() => addNeededBy(user?.userId, item.shoppingItemId)} className="text-3xl text-green-500" />
                      </button>
                    )}
                  </div>
                )}
                {!isMobile && existingShopper && isShopperLoggedIn && (
                  <div className="flex justify-end">
                    <button onClick={() => handleClick(item.shoppingItemId)} className="h-10 px-2 py-2 mt-4 w-20 rounded-md text-sm font-medium whitespace-nowrap bg-red-500 hover:bg-red-700 text-slate-50 dark:bg-slate-50 dark:text-slate-900">
                      Done
                    </button>
                  </div>
                )}
              </li>
            ))}
      </ul>
      <h1 className="text-lg font-medium">Completed</h1>
      <ul>
        {items
          ?.filter((item) => item.status === "completed")
          .map((item) => (
            <li key={item.shoppingItemId} className="grid grid-cols-1 grid-flow-col md:grid-cols-4 items-center my-6 border-b-2 opacity-40">
              <div>{item.title}</div>
              <div>
                <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-500 text-white dark:bg-blue-500">{item.status}</span>
              </div>
              {!isMobile && (
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  <div className="relative flex justify-center items-center w-10 h-10 overflow-hidden bg-blue-300 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">{getInitials(item.name)}</span>{" "}
                  </div>
                  {neededBy
                    ?.filter((needed) => item.shoppingItemId === needed.shoppingItemId)
                    .map((needed, index) => (
                      <div key={index} className="relative flex justify-center items-center w-10 h-10 overflow-hidden bg-green-300 rounded-full dark:bg-gray-600">
                        <span className="font-medium text-gray-600 dark:text-gray-300">{getInitials(needed.name)}</span>
                      </div>
                    ))}
                </div>
              )}
            </li>
          ))}
      </ul>
    </>
  );
}

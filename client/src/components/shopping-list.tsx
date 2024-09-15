import { useItems } from "@/context/useItems.tsx";
import { useUser } from "@/context/useUser";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";

type Props = {
  isMobile: boolean;
};

export function ShoppingList({ isMobile }: Props) {
  const { items, neededBy, removeShopItem } = useItems();
  const { user, getInitials } = useUser();

  return (
    <>
      <div className="grid grid-cols-1 grid-flow-col md:grid-cols-4 items-center gap-8 my-6">
        <p>Item</p>
        <p>Status</p>
        <p>Needed By</p>
      </div>
      <ul>
        {items
          ?.filter((item) => item.status === "pending")
          .map((item) => (
            <li key={item.shoppingItemId} className="grid grid-cols-1 grid-flow-col md:grid-cols-4 items-center my-6 border-b-2">
              <div>{item.title}</div>
              <div>
                <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-600 text-white dark:bg-blue-500">{item.status}</span>
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
              <div className="flex items-center justify-center space-x-2">
                <button>{item.userId === user?.userId ? <FaRegTrashAlt onClick={() => removeShopItem(item.shoppingItemId)} className="text-2xl text-red-400" /> : <IoMdAddCircleOutline className="text-3xl text-green-500" />}</button>
              </div>
            </li>
          ))}
      </ul>
      <h1 className="text-lg">Completed</h1>
      <ul>
        {items
          ?.filter((item) => item.status === "completed")
          .map((item) => (
            <li key={item.shoppingItemId} className="grid grid-cols-1 grid-flow-col md:grid-cols-4 items-center my-6 border-b-2 opacity-50">
              <div>{item.title}</div>
              <div>
                <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-green-500 text-white dark:bg-blue-500">{item.status}</span>
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

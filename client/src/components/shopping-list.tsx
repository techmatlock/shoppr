import { useItems } from "@/context/useItems.tsx";
import { useUser } from "@/context/useUser";

type Props = {
  isMobile: boolean;
};

export function ShoppingList({ isMobile }: Props) {
  const { items, neededBy } = useItems();
  const { getInitials } = useUser();

  return (
    <>
      <div className="grid grid-cols-1 grid-flow-col md:grid-cols-4 items-center gap-8 my-6">
        <p>Item</p>
        <p>Status</p>
        <p>Needed By</p>
      </div>
      <ul>
        {items?.map((item) => (
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
                  .map((needed) => (
                    <div className="relative flex justify-center items-center w-10 h-10 overflow-hidden bg-green-300 rounded-full dark:bg-gray-600">
                      <span className="font-medium text-gray-600 dark:text-gray-300">{getInitials(needed.name)}</span>
                    </div>
                  ))}
              </div>
            )}
            <div className="flex items-center justify-center space-x-2">
              <button className="h-10 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90">Need</button>
            </div>
          </li>
        ))}
      </ul>
      <h1 className="text-lg">Completed</h1>
      <ul>
        {items?.map((item) => (
          <li key={item.shoppingItemId} className="grid grid-cols-1 grid-flow-col md:grid-cols-4 items-center my-6 border-b-2 opacity-50">
            <div className="opacity-50">{item.title}</div>
            <div className="opacity-50">
              <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-green-600 text-white dark:bg-green-500">completed</span>
            </div>
            {!isMobile && (
              <div className="flex -space-x-4 rtl:space-x-reverse opacity-50">
                <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="/images/profile-picture-5.jpg" alt="" />
                <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="/images/profile-picture-2.jpg" alt="" />
                <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="/images/profile-picture-3.jpg" alt="" />
              </div>
            )}
            <div className="flex items-center justify-center space-x-2 opacity-50">
              <button className="h-10 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90">Need</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

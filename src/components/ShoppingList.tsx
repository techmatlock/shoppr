import { shoppingList } from "../lib/placeholder-data.ts";
import { CiMenuKebab } from "react-icons/ci";

type Props = {
  isMobile: boolean;
};
export function ShoppingList({ isMobile }: Props) {
  return (
    <ul>
      {shoppingList.map((item) => (
        <li key={item.shoppingItemId} className="grid grid-cols-1 grid-flow-col md:grid-cols-4 items-center my-6 border-b-2">
          <div>{item.title}</div>
          <div>{item.status}</div>
          {!isMobile && (
            <div className="flex -space-x-4 rtl:space-x-reverse">
              <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="/images/profile-picture-5.jpg" alt="" />
              <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="/images/profile-picture-2.jpg" alt="" />
              <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="/images/profile-picture-3.jpg" alt="" />
              <div className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full dark:border-gray-800">+99</div>
            </div>
          )}
          <CiMenuKebab className="w-full" />
        </li>
      ))}
    </ul>
  );
}

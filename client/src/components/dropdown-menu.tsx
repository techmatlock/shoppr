import { useUser } from "@/context/useUser";
import { useState } from "react";

export function DropDownMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, getInitials } = useUser();
  let initials = "";

  if (user) {
    initials = getInitials(user);
  }

  function handleClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div>
      <button onClick={handleClick}>
        <div className="relative flex justify-center items-center w-10 h-10 overflow-hidden bg-gray-300 rounded-full dark:bg-gray-600">
          <span className="font-medium text-gray-600 dark:text-gray-300">{initials}</span>
        </div>
      </button>
      {isOpen && (
        <div className="absolute right-10 top-14 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div>Bonnie Green</div>
            <div className="font-medium truncate">name@flowbite.com</div>
          </div>
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                Earnings
              </a>
            </li>
          </ul>
          <div className="py-1">
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

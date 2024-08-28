import { Outlet } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";

export function Header() {
  return (
    <div className="grid grid-rows-[1fr_auto] px-12">
      <header className="flex h-12 justify-between">
        <div className="flex items-center">
          <FaCartShopping className="text-green-500 w-full text-xl" />
          <p className="pl-2 text-md">shoppr</p>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

import { Outlet } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";

export function Header() {
  return (
    <div className="grid grid-rows-[1fr_auto] px-12">
      <header className="flex h-12">
        <div className="flex items-center">
          <FaCartShopping className="text-purple-500 w-full" />
          <p className="pl-2">shoppr</p>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

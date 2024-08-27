import { Outlet } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";

export function Header() {
  return (
    <div className="grid grid-rows-[1fr_auto] px-12">
      <header className="flex h-12 justify-between">
        <div className="flex items-center">
          <FaCartShopping className="text-purple-500 w-full text-xl" />
          <p className="pl-2 text-md">shoppr</p>
        </div>
        <div className="flex items-center justify-end">
          <img className="w-10 h-10 rounded-full" src="/images/profile-picture-5.jpg" alt="" />
        </div>
      </header>
      <Outlet />
    </div>
  );
}

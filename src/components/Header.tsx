import { Outlet } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";

export function Header() {
  return (
    <div className="grid grid-rows-[1fr_auto]">
      <header className="flex h-12 outline-dashed">
        <div className="flex items-center space-x-2">
          <FaCartShopping />
          <p>shoppr</p>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

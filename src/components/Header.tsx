import { Outlet } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";

export function Header() {
  return (
    <div className="grid grid-rows-[1fr_auto]">
      <header className="flex fixed h-12 w-full outline-dashed">
        <div className="flex items-center space-x-2">
          <FaCartShopping />
          <p>shoppr</p>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

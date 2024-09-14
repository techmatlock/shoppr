import { Outlet } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { DropDownMenu } from "@/components/dropdown-menu";
import { useUser } from "@/context/useUser";

export default function RootLayout() {
  const { user } = useUser();

  return (
    <>
      <header className="flex h-12 justify-between px-12">
        <div className="flex items-center">
          <FaCartShopping className="text-green-500 w-full text-xl" />
          <p className="pl-2 text-md">shoppr</p>
        </div>
        {user && (
          <div className="flex items-center">
            <DropDownMenu />
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

import { useEffect, useState } from "react";
import { AddNewForm } from "../components/add-new-form";
import { ShoppingList } from "../components/shopping-list";
import { SideBar } from "../components/sidebar";
import { FaCartShopping } from "react-icons/fa6";
import { DropDownMenu } from "../components/dropdown-menu";

export function IndexPage() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth <= 640) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
    function onResize() {
      if (window.innerWidth <= 640) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <header className="flex h-12 justify-between px-12 mb-2">
        <div className="flex items-center">
          <FaCartShopping className="text-green-500 w-full text-2xl" />
          <p className="pl-2 text-lg">shoppR</p>
        </div>
        <div className="flex items-center">
          <DropDownMenu />
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] px-12">
        <section>
          <AddNewForm />
          <ShoppingList isMobile={isMobile} />
        </section>
        {!isMobile && (
          <section className="shadow-md rounded-md h-full ml-4">
            <SideBar />
          </section>
        )}
      </div>
    </>
  );
}

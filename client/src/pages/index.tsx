import { useEffect, useState } from "react";
import { AddNewForm } from "../components/add-new-form";
import { ShoppingList } from "../components/shopping-list";
import { SideBar } from "../components/sidebar";
import { useUser } from "@/context/useUser";
import { useNavigate } from "react-router-dom";

export function IndexPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

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
  );
}

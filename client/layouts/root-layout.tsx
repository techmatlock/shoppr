import { Outlet, useNavigate } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { FaCartShopping } from "react-icons/fa6";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export default function RootLayout() {
  const navigate = useNavigate();

  return (
    <ClerkProvider routerPush={(to) => navigate(to)} routerReplace={(to) => navigate(to, { replace: true })} publishableKey={PUBLISHABLE_KEY}>
      <header className="flex h-12 justify-between px-12">
        <div className="flex items-center">
          <FaCartShopping className="text-green-500 w-full text-xl" />
          <p className="pl-2 text-md">shoppr</p>
        </div>
      </header>
      <main className="grid grid-cols-1 px-12">
        <Outlet />
      </main>
    </ClerkProvider>
  );
}

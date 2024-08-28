import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { NotFound } from "./pages/NotFound";
import { Home } from "./pages/Home";
import { Header } from "./components/Header";
import { useEffect, useState } from "react";
import { AuthPage } from "./pages/AuthPage";

export default function App() {
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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home isMobile={isMobile} />,
      index: true,
    },
    {
      path: "/sign-in",
      element: <AuthPage isMobile={isMobile} mode={"sign-in"} />,
    },
    {
      path: "/sign-up",
      element: <AuthPage isMobile={isMobile} mode={"sign-up"} />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <div>
      <Header />
      <RouterProvider router={router} />
    </div>
  );
}

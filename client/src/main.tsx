import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/root-layout";
import { SignInPage } from "./pages/sign-in";
import { SignUpPage } from "./pages/sign-up";
import { NotFoundPage } from "./pages/not-found";
import { IndexPage } from "./pages";
import { ItemsProvider } from "./context/ItemsContext";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <IndexPage /> },
      { path: "/sign-in/*", element: <SignInPage /> },
      { path: "/sign-up/*", element: <SignUpPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ItemsProvider>
        <RouterProvider router={router} />
      </ItemsProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

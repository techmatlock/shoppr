import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { SignInPage } from "./pages/sign-in";
import { SignUpPage } from "./pages/sign-up";
import { NotFoundPage } from "./pages/not-found";
import { IndexPage } from "./pages";
import { ItemsProvider } from "./context/ItemsContext";
import { UserProvider } from "./context/UserContext";
import { ProtectedRoutes } from "./pages/protected-routes";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <IndexPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <ItemsProvider>
            <RouterProvider router={router} />
          </ItemsProvider>
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

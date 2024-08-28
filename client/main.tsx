import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/root-layout";
import { IndexPage } from "./routes";
import SignInPage from "./routes/sign-in";
import SignUpPage from "./routes/sign-up";
import { NotFoundPage } from "./routes/not-found";

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
    <RouterProvider router={router} />
  </React.StrictMode>
);

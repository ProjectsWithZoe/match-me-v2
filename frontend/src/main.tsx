import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import AppPage from "./pages/AppPage";
import LandingPage from "./pages/LandingPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/app", element: <AppPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

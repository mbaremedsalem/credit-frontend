import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "../Layout/Layout";
import MainRouter from "./MainRouter";
import PublicLayout from "../Layout/PublicLayout";
import ErrorPage from "../Pages/ErrorPage";
import { useAuth } from "../Services/Auth/AuthProvider";
import SpinnerLoader from "../Ui/Spinner";

const Router = () => {
  const { loading, isAuthenticated } = useAuth(); 
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    if (!loading) {
      setIsCheckingAuth(false);
    }
  }, [loading]);

  // Routes publiques accessibles sans authentification
  const publicRoutes = [
    "/login", 
    "/forget-password", 
    "/reset-password", 
    "/reset-success", 
    "/otp", 
    "/register",
    "/success-send-email", 
    "/success-reset-password"
  ];

  // Routes de reset avec token (traitement spécial)

  if (isCheckingAuth) {
    return <SpinnerLoader />;
  }

  const routes = MainRouter.map((route) => {
    const isPublicRoute = publicRoutes.includes(route.path || '');
    

    // Redirection pour les utilisateurs NON authentifiés essayant d'accéder à des routes privées
    if (!isAuthenticated && route.layout === "private") {
      return {
        ...route,
        element: <Navigate replace to="/login" />
      };
    }

    // Redirection pour les utilisateurs authentifiés essayant d'accéder à des routes publiques
    if (isAuthenticated && (isPublicRoute || route.layout === "public")) {
      return {
        ...route,
        element: <Navigate replace to="/" />
      };
    }

    // Gestion des layouts
    let element = route.element;
    
    if (route.layout === "private") {
      element = <Layout>{route.element}</Layout>;
    } else if (route.layout === "public") {
      element = <PublicLayout>{route.element}</PublicLayout>;
    }

    return {
      ...route,
      element: element || <ErrorPage status="404" message="Page not found" />
    };
  });

  const router = createBrowserRouter(routes); 
  return <RouterProvider router={router} />;
};

export default Router;
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "../Layout/Layout";
import PublicLayout from "../Layout/PublicLayout";
import MainRouter from "./MainRouter";
import { useAuth } from "../Services/Auth/AuthProvider";
import SpinnerLoader from "../Ui/Spinner";
import { useAutoLogout } from "../Services/Auth/useAutoLogout";
import AuthService from "../Auth-Services/AuthService";

const Router = () => {
  const { loading, isAuthenticated } = useAuth();
  const { resetTimer } = useAutoLogout();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      resetTimer();
    }
  }, [isAuthenticated, resetTimer]);

  useEffect(() => {
    if (!loading) {
      setIsCheckingAuth(false);
    }
  }, [loading]);



  if (isCheckingAuth) {
    return <SpinnerLoader />;
  }

  console.log("access : ", AuthService.getAccessToken())
  console.log("refresh : ", AuthService.getRefreshToken())
  console.log("isAuthenticated : ", isAuthenticated)
  // const routes = MainRouter.map((route) => {
  //   const isPublicRoute =
  //     publicRoutes.includes(route.path || "") ||
  //     route.layout === "public";

  //   /* 🔒 Non authentifié → accès interdit aux routes privées */
  //   if (!isAuthenticated && !isPublicRoute) {
  //     return {
  //       ...route,
  //       element: <Navigate to="/no-autorise" replace />,
  //     };
  //   }

  //   /* 🔓 Authentifié → interdit d’aller sur routes publiques */
  //   if (isAuthenticated && isPublicRoute) {
  //     return {
  //       ...route,
  //       element: <Navigate to="/" replace />,
  //     };
  //   }

  //   /* 🎨 Gestion des layouts */
  //   let element = route.element;

  //   if (route.layout === "private") {
  //     element = <Layout>{route.element}</Layout>;
  //   }

  //   if (route.layout === "public") {
  //     element = <PublicLayout>{route.element}</PublicLayout>;
  //   }

  //   return {
  //     ...route,
  //     element: element ?? (
  //       <ErrorPage status="404" message="Page not found" />
  //     ),
  //   };
  // });



  const routes = MainRouter.map((route) => {
  const hasAccessToken = !!AuthService.getAccessToken();
  const isPublicRoute = route.layout === "public";

  /* 🔒 NON AUTH + PAS DE TOKEN → routes privées interdites */
  if (!isAuthenticated && !hasAccessToken && route.layout === "private") {
    return {
      ...route,
      element: <Navigate to="/no-autorise" replace />,
    };
  }

  /* 🔓 AUTH OU TOKEN → routes publiques interdites
     ⚠️ SAUF /login (SSO handler)
  */
  if (
    (isAuthenticated || hasAccessToken) &&
    isPublicRoute &&
    route.path !== "/login"
  ) {
    return {
      ...route,
      element: <Navigate to="/" replace />,
    };
  }

  /* 🎨 Layout */
  let element = route.element;

  if (route.layout === "private") {
    element = <Layout>{route.element}</Layout>;
  }

  if (route.layout === "public") {
    element = <PublicLayout>{route.element}</PublicLayout>;
  }

  return {
    ...route,
    element,
  };
});



  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default Router;

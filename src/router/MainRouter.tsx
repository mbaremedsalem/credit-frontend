import { lazy, Suspense } from "react";
import SpinnerLoader from "../Ui/Spinner";

const Login = lazy(() => import("../Pages/Auth/Login"));
const Register = lazy(() => import("../Pages/Auth/Register"));
const ForgetPassword = lazy(() => import("../Pages/Auth/ForgetPassword"));
const ResetPassword = lazy(() => import("../Pages/Auth/ResetPassword"));
const Home = lazy(() => import("../Pages/Home"));
import ErrorPage from "../Pages/ErrorPage"
const DossierStatus = lazy(() => import("../Pages/Dossier/DossierView"));
const Demandes = lazy(() => import("../Pages/Demandes/PageViewDemande"));
const Historique = lazy(() => import("../Pages/Historiques/HistoriqueView"));
const Processus = lazy(() => import("../Pages/Processus/Processus"));
// const Quide = lazy(() => import("../Pages/Quite/Quide"));


var MainRouter = [
    {
        path:"/login",
        element: (
            <Suspense  fallback={  <SpinnerLoader/>}>
              < Login/>
            </Suspense>
          ),
        layout : "public",
        role:"admin"
    },
    {
      path:"/register",
      element: (
          <Suspense  fallback={  <SpinnerLoader/>}>
            < Register/>
          </Suspense>
        ),
      layout : "public",
      role:"admin"
  },
    {
        path:"/forget-password",
        element: (
            <Suspense fallback={  <SpinnerLoader/>}>
              < ForgetPassword/>
            </Suspense>
          ),
        layout : "public",
        role:"admin"
    },
    {
        path:"/reset-password/:token",
        element: (
            <Suspense fallback={  <SpinnerLoader/>}>
              < ResetPassword/>
            </Suspense>
          ),
        layout : "public",
        role:"admin"
    },
    {
        path:"/",
        element: (
            <Suspense fallback={  <SpinnerLoader/>}>
              < Home/>
            </Suspense>
          ),
        layout : "private",
        role:"admin"
    },
   
    {
      path:"/dossier",
      element: (
          <Suspense fallback={  <SpinnerLoader/>}>
            < DossierStatus/>
          </Suspense>
        ),
      layout : "private",
      role:"admin"
  },
  //   {
  //     path:"/credit",
  //     element: (
  //         <Suspense fallback={  <SpinnerLoader/>}>
  //           < CreditStatus/>
  //         </Suspense>
  //       ),
  //     layout : "private",
  //     role:"admin"
  // },
  {
    path:"/commite",
    element: (
        <Suspense fallback={  <SpinnerLoader/>}>
          < Home/>
        </Suspense>
      ),
    layout : "private",
    role:"admin"
},
{
  path:"/demande",
  element: (
      <Suspense fallback={  <SpinnerLoader/>}>
        < Demandes/>
      </Suspense>
    ),
  layout : "private",
  role:"admin"
},
{
  path:"/historique",
  element: (
      <Suspense fallback={  <SpinnerLoader/>}>
        < Historique/>
      </Suspense>
    ),
  layout : "private",
  role:"admin"
},
{
  path:"/processus",
  element: (
      <Suspense fallback={  <SpinnerLoader/>}>
        < Processus/>
      </Suspense>
    ),
  layout : "private",
  role:"admin"
},
// {
//   path:"/quide",
//   element: (
//       <Suspense fallback={  <SpinnerLoader/>}>
//         < Quide/>
//       </Suspense>
//     ),
//   layout : "private",
//   role:"admin"
// },

    {
        path:"*",
        element: (
            <Suspense fallback={  <SpinnerLoader/>}>
              < ErrorPage status="404" message="Page not found"/>
            </Suspense>
          ),
        layout : "",
        role:""
    },
]


export default MainRouter
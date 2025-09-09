import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { BaseUrl } from "../../api/BaseUrl";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

export type LoginParams = {
  username: string;
  password: string;
};

async function login(params: LoginParams) {
  const res = await axios.post(
    `${BaseUrl}auth/token/`,
    {
      username: params.username,
      password: params.password,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  sessionStorage.setItem("access", res.data.access);
  sessionStorage.setItem("refresh_token", res.data.refresh_token);
  sessionStorage.setItem("post", res.data.post);
  sessionStorage.setItem("poit", res.data.poit);
  sessionStorage.setItem("role", res.data.role);
  sessionStorage.setItem("nom", res.data.nom);
  sessionStorage.setItem("id", res.data.id);
  sessionStorage.setItem("agence", res.data.agence);

  return res.data;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuthState } = useAuth();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.status === 200) {
        setTimeout(() => {
          // window.location.href = "/";
          setAuthState({
            loading: false,
            isAuthenticated: true,
          });
          navigate("/", { replace: true });
          return navigate("/", { replace: true });
        }, 500);
        const message = "Bienvenue " + data.nom;
        return enqueueSnackbar(message, { variant: "success" });
      } else {
        return enqueueSnackbar("Error username ou mot de passe incorrect", {
          variant: "error",
        });
      }
    },
    onError: (data: any) => {
      if (data?.code === "ERR_NETWORK" || data?.message === "Network Error") {
        return enqueueSnackbar("Erreur réseau : le serveur est injoignable", {
          variant: "error",
        });
      }

      if (data.status === 400) {
        return enqueueSnackbar("Error", { variant: "error" });
      }

      return enqueueSnackbar(
        "Une erreur est survenue. Veuillez réessayer plus tard.",
        {
          variant: "error",
        }
      );
    },
  });
};

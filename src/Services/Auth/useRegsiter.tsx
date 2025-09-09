import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { BaseUrl } from "../../api/BaseUrl";
import { enqueueSnackbar } from "notistack";

export type RegisterParams = {
  nom: string;
  prenom: string;
  phone: string;
  username: string;
  email: string;
  address: string;
  post: string;
  role: string;
  poit: number;
  password: string;
  agence: string;
};

async function register(params: RegisterParams) {
  const res = await axios.post(`${BaseUrl}auth/register/`, params, {
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
}

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      return enqueueSnackbar("success register !", { variant: "success" });
    },
    onError: (error: any) => {
      const existPHone = error?.response?.data?.phone?.[0];
      if (existPHone) {
        return enqueueSnackbar(existPHone, { variant: "error" });
      }
    },
  });
};

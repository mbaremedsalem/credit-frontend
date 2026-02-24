import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { BaseUrl } from "../../api/BaseUrl";

export type CredantialsParams = {
  username: string;
};

export type CredantialsResponse = {
  username: string;
  password: string;
};

async function usercredantials(params: CredantialsParams): Promise<CredantialsResponse> {

  const res = await axios.post(
    `${BaseUrl}auth/get-user-credentials/`,
    {
      username: params.username,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return res.data;
}

export const useGetUserCredantiels = () => {
  return useMutation({
    mutationFn: usercredantials,
    onSuccess: () => {
      // Vous pouvez également gérer le succès ici si nécessaire
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
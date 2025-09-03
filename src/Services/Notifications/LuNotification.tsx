

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { BaseUrl } from "../../api/BaseUrl";
import { NOTIFCATION_KEY } from "./useGetNotifications";
import { handleError } from "../../Lib/HandleError";

export const useLuNotifications = () => {
  const queryClient = useQueryClient();
  async function luNotifications({userid}:{userid : string}) {
  
    
    const res = await axios.post(`${BaseUrl}api/notifications/mark-all-as-read/`, 
        {userid : userid}, {
      headers: {
        "Content-Type": "application/json"
      },
    });
    return res.data;
  }
  return useMutation({
    mutationFn: luNotifications,
    mutationKey: NOTIFCATION_KEY,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFCATION_KEY,
      });
      enqueueSnackbar("notifications vu !", { variant: "success" });

    },
    onError: (err: any) => {
      console.log("err est : ", err?.response?.data?.error)
      const errorMessage = handleError(err);
      const errorPackage =  err?.response?.data?.error
      if(errorPackage){
        return enqueueSnackbar(errorPackage, { variant: "error" });

      }
      if(err?.response?.data?.error === "UNIQUE constraint failed: commite_client.client_code") {
       
              return enqueueSnackbar("L'utilisateur existe déjà !", { variant: "error" });
      } if (err?.response?.data?.error === "['“null” value has an invalid date format. It must be in YYYY-MM-DD format.']") {
  return enqueueSnackbar(
    "La date d'expiration du carte ou passport client est null dans CoreBanking et doit être ajoutée !",
    { variant: "error" }
  );
} else {
        message.error(errorMessage);

      }
    },
  });
};
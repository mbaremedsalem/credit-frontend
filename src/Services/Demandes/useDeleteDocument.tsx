

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { handleError } from "../../Lib/HandleError";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { BaseUrl } from "../../api/BaseUrl";
import { CREDIT_LIGNE_KEY } from "./useGetunSeulCredit";

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  async function deleteDocument({credit_id}:{credit_id:string|number}) {
 
    
    
    const res = await axios.delete(`${BaseUrl}api/documents/${credit_id}/delete/`, );
    return res.data;
  }
  return useMutation({
    mutationFn: deleteDocument,
    mutationKey: CREDIT_LIGNE_KEY,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CREDIT_LIGNE_KEY,
      });
      enqueueSnackbar("document supprime avec succès !", { variant: "success" });

    },
    onError: (err: any) => {
      console.log("err est : ", err?.response?.data?.error)
      const errorMessage = handleError(err);
   
      
        message.error(errorMessage);

      
    },
  });
};


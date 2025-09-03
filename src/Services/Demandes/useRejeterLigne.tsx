import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { handleError } from "../../Lib/HandleError";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { LIGNES_KEY } from "./useGetLigneCredit";
import { BaseUrl } from "../../api/BaseUrl";
export type RejeterLigne = {
    user_id?:number,
    id_credit?:number, 
    motif? : string
}
export const useRejeterLigne = () => {
  const queryClient = useQueryClient();
  async function rejeterligne(ligne: RejeterLigne) {
    
    console.log("user : ", )
    
   

    
    const res = await axios.post(`${BaseUrl}api/credits/${ligne.id_credit}/rejeter/`, 
        {user_id:ligne?.user_id,
            motif:ligne?.motif
        }, {
   
    });
    return res.data;
  }
  return useMutation({
    mutationFn: rejeterligne,
    mutationKey: LIGNES_KEY,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIGNES_KEY,
      });
      enqueueSnackbar("Crédit rejeté avec succès.", { variant: "success" });
      message.success("Crédit rejeté avec succès. !!")
    },
    onError: (err: any) => {
      console.log("err est : ", err?.response?.data?.error)
      const errorMessage = handleError(err);
   
      if(err?.response?.data?.error) {
       
              return enqueueSnackbar(err?.response?.data?.error, { variant: "error" });
      } else {
        message.error(errorMessage);

      }
    },
  });
};
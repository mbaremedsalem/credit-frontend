import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { handleError } from "../../Lib/HandleError";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { LIGNES_KEY } from "./useGetLigneCredit";
import { BaseUrl } from "../../api/BaseUrl";
import AuthService from "../../Auth-Services/AuthService";
export type ValiderLigne = {
    user_id?:number,
    id_credit?:number,
    motiv?:string
    memo?:string,
    documents: File;
  


}
export const useValiderLigne = () => {
  const queryClient = useQueryClient();
  const userIdConnect = AuthService.getIDUserConnect()
  async function validerligne(ligne: ValiderLigne) {
    const formData = new FormData();
    
    formData.append("memo", ligne?.memo!);
    formData.append("user_id", String(userIdConnect));
    formData.append("motiv", ligne.motiv!);

    
        
    if(ligne.documents){
      
      formData.append(`documents`, ligne.documents); 

    }
    
    
    const res = await axios.post(`${BaseUrl}api/credits/${ligne.id_credit}/remonter/`, formData);
    return res.data;
  }
  return useMutation({
    mutationFn: validerligne,
    mutationKey: LIGNES_KEY,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIGNES_KEY,
      });
      enqueueSnackbar("Ligne de Crédit validé et remonté !", { variant: "success" });
    },
    onError: (err: any) => {
      console.log("err est : ", err?.response?.data?.error)
      const errorMessage = handleError(err);

      console.log("error : ", err)
      if(err?.response?.data?.error) {
       
        return enqueueSnackbar( err?.response?.data?.error, { variant: "error" });
      } else {
        message.error(errorMessage);

      }
    },
  });
};
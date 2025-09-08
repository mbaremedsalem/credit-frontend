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
    documents: File | File[];
}
export const useValiderLigne = () => {
  const queryClient = useQueryClient();
  const userIdConnect = AuthService.getIDUserConnect()
  async function validerligne(ligne: ValiderLigne) {

    console.log("doc credit : ", ligne)
    const formData = new FormData();
    
    formData.append("memo", ligne?.memo!);
    formData.append("user_id", String(userIdConnect));
    formData.append("motiv", ligne.motiv!);

     if (ligne.documents) {
      if (Array.isArray(ligne.documents)) {
        ligne.documents.forEach((file, index) => {
          console.log("index : ", index)
          formData.append(`documents`, file); // Use the same field name for multiple files
          // formData.append(`documents[${index}]`, file);
        });
      } else {
        // If it's a single file, append it directly
        formData.append(`documents`, ligne.documents);
      }
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
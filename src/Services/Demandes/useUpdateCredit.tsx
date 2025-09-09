import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { handleError } from "../../Lib/HandleError";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { LIGNES_KEY } from "./useGetLigneCredit";
import { BaseUrl } from "../../api/BaseUrl";
import AuthService from "../../Auth-Services/AuthService";


export type typUpdateCredit = {
    id:string|number,
    montant : number,
    duree:number, 
    avis:string,
    memo :string,
    type_credit:string,
    nature_credit : string,
    fichiers: {
    file: File;
    type_document: string;
    previewUrl?: string;
  }[];

}
export const useUpdateCredit = () => {
  const queryClient = useQueryClient();
  

  async function updateCredit(ligne: typUpdateCredit) {
    const formData = new FormData();
  const idUserConnect = AuthService.getIDUserConnect()

    formData.append("montant", ligne?.montant?.toString()!);
    formData.append("duree", ligne?.duree?.toString()!);
    formData.append("avis", ligne?.avis!);
    formData.append("memo", ligne?.memo!);
    formData.append("type_credit", ligne?.type_credit!);
    formData.append("nature_credit", ligne.nature_credit!);

    formData.append("user_id", String(idUserConnect))
    
   

    ligne.fichiers?.forEach((doc) => {
        formData.append(`documents`, doc?.file); 
        formData.append(`type_document`, doc?.type_document); 
      });

    
    const res = await axios.put(`${BaseUrl}api/credits/${ligne.id}/update/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
  return useMutation({
    mutationFn: updateCredit,
    mutationKey: LIGNES_KEY,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIGNES_KEY,
      });
      enqueueSnackbar("Crédit modifiee avec succès !", { variant: "success" });

    },
    onError: (err: any) => {
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
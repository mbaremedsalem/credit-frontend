import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { handleError } from "../../Lib/HandleError";
import { AddLigne } from "../types/Demande";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { LIGNES_KEY } from "./useGetLigneCredit";
import { BaseUrl } from "../../api/BaseUrl";
import AuthService from "../../Auth-Services/AuthService";
import { useNavigate } from "react-router-dom";

export const useAddligne = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  async function addligne(ligne: AddLigne) {
    const formData = new FormData();
    const agence = AuthService.getAGENCEUserConnect()
    console.log("ligne : ", ligne)
    formData.append("CLIENT", ligne?.CLIENT!);
    formData.append("IDENTIFIENT", ligne?.IDENTIFIENT!);
    formData.append("PAYSNAIS", ligne?.PAYSNAIS!);
    formData.append("DATNAIS", ligne?.DATNAIS!);
    formData.append("NOM", ligne?.NOM!);
    formData.append("PRENOM", ligne?.PRENOM!);
    formData.append("TEL", ligne?.TEL!);
    formData.append("SEXE", ligne?.SEXE!);
    formData.append("TYPE_DOCUMENT", ligne?.TYPE_DOCUMENT!);
    formData.append("NNI", ligne.NNI!);
    formData.append("AGENCE", ligne?.AGENCE!);
    formData.append("TYPE_CLIENT", ligne?.TYPE_CLIENT!);
    formData.append("montant", ligne?.montant.toString()!);
    formData.append("duree", ligne?.duree.toString()!);
    formData.append("avis", ligne?.avis!);
    formData.append("memo", ligne?.memo!);
    formData.append("user_id", String(ligne?.user_id!));
    formData.append("agnece", agence!);
    formData.append("type_credit", ligne?.type_credit!);
    formData.append("nature_credit", ligne.nature_credit!);
    formData.append("type_dossier", "Particulier");
    
   

    ligne.fichiers?.forEach((doc) => {
        formData.append(`documents`, doc?.file); 
        formData.append(`type_document`, doc?.type_document); 
      });
    console.log("ligne data : ", ligne)
    
    const res = await axios.post(`${BaseUrl}api/createdemande/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
  return useMutation({
    mutationFn: addligne,
    mutationKey: LIGNES_KEY,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIGNES_KEY,
      });
      enqueueSnackbar("Crédit ajoutée avec succès !", { variant: "success" });
      navigate("/dossier")
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
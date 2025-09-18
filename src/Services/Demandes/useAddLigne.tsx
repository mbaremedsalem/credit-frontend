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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  async function addligne(ligne: AddLigne) {
    const formData = new FormData();
    const agence = AuthService.getAGENCEUserConnect();
    
    // Ajout des champs obligatoires
    formData.append("CLIENT", ligne.CLIENT!);
    formData.append("IDENTIFIENT", ligne.IDENTIFIENT!);
    formData.append("PAYSNAIS", ligne.PAYSNAIS!);
    formData.append("DATNAIS", ligne.DATNAIS!);
    formData.append("NOM", ligne.NOM!);
    formData.append("PRENOM", ligne.PRENOM!);
    formData.append("TEL", ligne.TEL!);
    formData.append("SEXE", ligne.SEXE!);
    formData.append("TYPE_DOCUMENT", ligne.TYPE_DOCUMENT!);
    formData.append("NNI", ligne.NNI!);
    formData.append("AGENCE", ligne.AGENCE!);
    formData.append("TYPE_CLIENT", ligne.TYPE_CLIENT!);
    formData.append("montant", ligne.montant.toString());
    formData.append("duree", ligne.duree.toString());
    formData.append("avis", ligne.avis!);
    formData.append("memo", ligne.memo!);
    formData.append("user_id", String(ligne.user_id!));
    formData.append("agnece", agence!);
    formData.append("type_credit", ligne.type_credit!);
    formData.append("nature_credit", ligne.nature_credit!);
    formData.append("type_dossier", "Particulier");
    
    // Ajout des fichiers
    ligne.fichiers?.forEach((doc) => {
      formData.append("documents", doc.file); 
      formData.append("type_document", doc.type_document); 
    });
    
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
      enqueueSnackbar("Crédit ajouté avec succès !", { variant: "success" });
      navigate("/dossier");
    },
    onError: (err: any) => {
      const errorMessage = handleError(err);
      const responseData = err?.response?.data;
      const errorUpload = responseData?.message;
      const isExist = responseData?.error;
      const errorStatus = responseData?.status;

      console.log("Erreur détectée : ", isExist);
      console.log("Statut de l'erreur : ", errorStatus);
      
      // Gestion des erreurs spécifiques
      if (isExist === "Une demande pour ce client existe déjà et n'est pas rejetée.") {
        // Gestion spécifique pour les demandes existantes
        return enqueueSnackbar(isExist, { variant: "warning" });
      }
      else if (isExist === "UNIQUE constraint failed: commite_client.client_code") {
        return enqueueSnackbar("L'utilisateur existe déjà !", { variant: "error" });
      }
      else if (isExist?.includes("null") && isExist?.includes("date format") && isExist?.includes("YYYY-MM-DD")) {
        return enqueueSnackbar(
          "La date d'expiration de la carte ou du passeport du client est manquante dans CoreBanking et doit être ajoutée !",
          { variant: "error" }
        );
      }
      else if (errorUpload) {
        return enqueueSnackbar(errorUpload, { variant: "error" });
      }
      else {
        message.error(errorMessage);
      }
    },
  });
};
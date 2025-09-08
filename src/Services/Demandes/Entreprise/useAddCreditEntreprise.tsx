import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import AuthService from "../../../Auth-Services/AuthService";
import { BaseUrl } from "../../../api/BaseUrl";
import { AddCreditEntreprise } from "./Type";
import { LIGNES_KEY } from "../useGetLigneCredit";
import { handleError } from "../../../Lib/HandleError";
import { useNavigate } from "react-router-dom";

export const useAddCreditEntreprise = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  async function addCreditEntreprise(ligne: AddCreditEntreprise) {
    console.log("ligne credit entreprise : ", ligne);
    const formData = new FormData();
    const agence = AuthService.getAGENCEUserConnect();
    const user_id = AuthService.getIDUserConnect();
    console.log("agence : ", agence);
    formData.append("CLIENT", ligne?.CLIENT!);
    formData.append("NOM", ligne?.NOM!);
    formData.append("AGENCE", ligne?.AGENCE!);
    formData.append("TEL", ligne?.TEL!);

    formData.append("montant", ligne?.montant.toString()!);
    formData.append("duree", ligne?.duree.toString()!);
    formData.append("avis", ligne?.avis!);
    formData.append("memo", ligne?.memo!);
    formData.append("user_id", String(user_id));
    formData.append("agnece", agence!);
    formData.append("type_credit", ligne?.type_credit!);
    formData.append("nature_credit", ligne.nature_credit!);
    formData.append("type_dossier", "Entreprise");
    formData.append("NIF", ligne?.NIF);
    formData.append("Address", ligne?.Address);

    ligne.fichiers?.forEach((doc) => {
      formData.append(`documents`, doc?.file);
      formData.append(`type_document`, doc?.type_document);
    });

    console.log("ligne : ");

    const res = await axios.post(`${BaseUrl}api/createdemande/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
  return useMutation({
    mutationFn: addCreditEntreprise,
    mutationKey: LIGNES_KEY,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIGNES_KEY,
      });
      enqueueSnackbar("Crédit ajoutée avec succès !", { variant: "success" });
      navigate("/dossier");
    },
    onError: (err: any) => {
      console.log("err est : ", err?.response?.data?.error);
      const errorMessage = handleError(err);
      const errorPackage = err?.response?.data?.error;
      if (errorPackage) {
        return enqueueSnackbar(errorPackage, { variant: "error" });
      }
      if (
        err?.response?.data?.error ===
        "UNIQUE constraint failed: commite_client.client_code"
      ) {
        return enqueueSnackbar("L'utilisateur existe déjà !", {
          variant: "error",
        });
      }
      if (
        err?.response?.data?.error ===
        "['“null” value has an invalid date format. It must be in YYYY-MM-DD format.']"
      ) {
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

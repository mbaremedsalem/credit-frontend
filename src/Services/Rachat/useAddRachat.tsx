import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../Lib/HandleError";
import AuthService from "../../Auth-Services/AuthService";
import { typeAddRachat } from "./typeRachat";
import { BaseUrl } from "../../api/BaseUrl";
import { RACHAT_KEY } from "./useGetRachat";

export const useAddRachat = () => {
    const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function addRachat(rachat: typeAddRachat) {
    const formData = new FormData();
    const user_id = AuthService.getIDUserConnect();

    formData.append("createur_id", String(user_id));
    formData.append("nom", rachat.nom!);
    formData.append("prenom", rachat.prenom!);
    formData.append("tel", rachat.tel!);
    formData.append("email", rachat.email!);
    formData.append("nni", rachat.nni!);
    formData.append("adresse", rachat.adresse!);
    formData.append("montant_rachat", rachat.montant_rachat!);
    formData.append("institution_actuelle", rachat.institution_actuelle!);
    formData.append("type_credit", rachat.type_credit!);
    formData.append("duree_restante_mois", rachat.duree_restante_mois!);
    formData.append("montant_restant", "0");

    // Ajout des fichiers
    if (rachat.carte_identite_file) {
      formData.append("carte_identite_file", rachat.carte_identite_file);
    }
    if (rachat.justificatif_domicile_file) {
      formData.append(
        "justificatif_domicile_file",
        rachat.justificatif_domicile_file,
      );
    }

    console.log("formData submitted : ", formData);

    const res = await axios.post(
      `${BaseUrl}api/rachat-credit/create/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  }

  return useMutation({
    mutationFn: addRachat,
    mutationKey: RACHAT_KEY,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RACHAT_KEY,
      });
      enqueueSnackbar("Rachat ajouté avec succès !", { variant: "success" });
      navigate("/dossier?tab=rachat");
    },
    onError: (err: any) => {
      const errorMessage = handleError(err);
      const responseData = err?.response?.data;
      const errorUpload = responseData?.message;

      if (errorUpload) {
        return enqueueSnackbar(errorUpload, { variant: "error" });
      } else {
        message.error(errorMessage);
      }
    },
  });
};

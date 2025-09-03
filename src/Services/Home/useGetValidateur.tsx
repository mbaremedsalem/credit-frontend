import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../../api/BaseUrl";

export const CLIENTS_KEY = ["client"];

export type ValidateurStatus = {
  id: number;
  poste: string;
  validateur: string; 
  agnece: string; 
  nom: string;
  prenom: string;
  moyenne_temps_validation: number;
  nb_validations: number;
  nb_rejete: number;
  rang: number;
};


export const STATS_KEY = ["validateur-"];

async function getStats(): Promise<ValidateurStatus[]> {
  const res = await axios.get(
    `${BaseUrl}api/stats/validateurs-premiers/`,

    {
      headers: { "Content-Type": "application/json" },
    }
  );
  console.log(" response data : ", res.data);
  return res.data;
}
export const useGetStatusValidateur = () => {
  return useQuery({
    queryKey: ["validateur-"],
    queryFn: () => getStats(),
  });
};

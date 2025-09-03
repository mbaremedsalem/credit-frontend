import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../../api/BaseUrl";

export const CLIENTS_KEY = ["client"];

export type Stats = {
  total: number;
  valides: number;
  rejetes: number;
  en_cours: number;
  montant_total: number;
  duree_moyenne: number;
  credits_par_agence: {
    agence: string;
    count: string;
  }[];
  repartition_type_dossier: {
    type_dossier: string;
    count: string;
  }[];
  delai_moyen_traitement_jours: string;
};


export const STATS_KEY = ["stats-"];

async function getStats(): Promise<Stats> {
  const res = await axios.get(
    `${BaseUrl}api/stats/`,

    {
      headers: { "Content-Type": "application/json" },
    }
  );
  console.log(" response data : ", res.data);
  return res.data;
}
export const useGetStats = () => {
  return useQuery({
    queryKey: ["stats-"],
    queryFn: () => getStats(),
  });
};

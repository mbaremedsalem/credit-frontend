import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../../api/BaseUrl";

export const STATS_PAR_AGENCE_KEY = ["stats-par-agence"];

export type StatAgence = {
  total: number;
  valides: number;
  rejetes: number;
  en_cours: number;
  montant_total: number;
  duree_moyenne: number;
  repartition_type_dossier: {
    type_dossier: string;
    count: number;
  }[];
  delai_moyen_traitement_jours: number;
};

export type StatsParAgence = {
  [agenceCode: string]: StatAgence;
};

async function getStatsParAgence(): Promise<StatsParAgence> {
  const res = await axios.get(
    `${BaseUrl}api/stats-par-agence/`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
}

export const useGetStatParagence = () => {
  return useQuery({
    queryKey: STATS_PAR_AGENCE_KEY,
    queryFn: getStatsParAgence,
  });
}; 
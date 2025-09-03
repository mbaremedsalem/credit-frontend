

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {  LigneCredit } from "../type";
import { BaseUrl } from "../../api/BaseUrl";

export const LIGNES_KEY = ["lignes"];

async function getDemandes(client?: string, min?: string, max?: string): Promise<LigneCredit[]> {
  const params = new URLSearchParams();

  if (client) params.append("client_code", client);
  if (min) params.append("date_min", min);
  if (max) params.append("date_max", max);

  const url = `${BaseUrl}api/credits/?${params.toString()}`;

  const res = await axios.get(url, {
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
}

export const useGetLingeCredit = (client?: string, min?: string, max?: string) => {
  return useQuery({
    queryKey: ["lignes", client, min, max],
    queryFn: () => getDemandes(client, min, max),
  });
};

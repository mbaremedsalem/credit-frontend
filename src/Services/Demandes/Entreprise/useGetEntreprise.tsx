



import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { EnterpriseType } from "./Type";
import { BaseUrl } from "../../../api/BaseUrl";

export const CLIENTS_KEY = ["client"];



async function getEntreprises(client: string): Promise<EnterpriseType[] | null> {
  if (!client) return null;

  const url = `${BaseUrl}api/comptes-entreprise/?client=${client}`;
  try {
    const res = await axios.get(url, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data ? res.data : null;
  } catch (error) {
    return null;
  }
}

export const useGetEntreprises = (client: string) => {
  return useQuery({
    queryKey: ["entreprises", client],
    queryFn: () => getEntreprises(client),

  });
};



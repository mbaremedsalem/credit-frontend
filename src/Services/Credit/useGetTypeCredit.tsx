

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../../api/BaseUrl";

export const CLIENTS_KEY = ["client"];

export type TypeCredit = {
  ncg: string,
  libelle: string,
  librel: string
  
};


export const STATS_KEY = ["validateur-"];

async function getTypeCredit(): Promise<TypeCredit[]> {
  const res = await axios.post(
    `${BaseUrl}api/ncg-lib/`,

    {
      headers: { "Content-Type": "application/json" },
    }
  );
  console.log(" response data : ", res.data);
  return res.data;
}
export const useGetTypeCredit = () => {
  return useQuery({
    queryKey: ["credit-type"],
    queryFn: () => getTypeCredit(),
  });
};

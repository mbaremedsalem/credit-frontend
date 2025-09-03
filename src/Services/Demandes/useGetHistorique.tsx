

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {  CreditData } from "../type";
import { BaseUrl } from "../../api/BaseUrl";

export const HISTORIQUE_KEY = ["historique"];

async function getHistoriqueLigneCredit(id:string|number): Promise<CreditData> {
    const res = await axios.get(
        `${BaseUrl}api/credits/${id}/historiques-complet/`,
     
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  console.log(" response data : ", res.data)
  return res.data;
}
export const useGetHistoriqueLigneCredit = (id:string|number) => {
  return useQuery({
    queryKey: ["historique", id],
    queryFn: () =>
        getHistoriqueLigneCredit(id),
  });
};



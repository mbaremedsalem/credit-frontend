





import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {  LigneCredit } from "../type";
import { BaseUrl } from "../../api/BaseUrl";

export const CREDIT_LIGNE_KEY = ["seul-credit"];

async function getSeulCredit(client?: string): Promise<LigneCredit> {

  const url = `${BaseUrl}api/credits/${client}/`;

  const res = await axios.get(url, {
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
}

export const useGetSeulCredit = (client?: string) => {
  return useQuery({
    queryKey: ["seul-credit", client],
    queryFn: () => getSeulCredit(client),
  });
};

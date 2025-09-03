

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../../api/BaseUrl";

export const LIGNES_KEY = ["lignes"];

export type TypeDocument = {
    nom : string,
    value:string,
    label:string,
    type_client:string,

}
async function getTypeDocument(type_client?: string): Promise<TypeDocument[]> {
  const params = new URLSearchParams();

  if (type_client) params.append("type_client", type_client);


  const url = `${BaseUrl}api/types-documents/?${params.toString()}`;

  const res = await axios.get(url, {
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
}

export const useGetTypeDocument = (type_client?: string) => {
  return useQuery({
    queryKey: ["document-type", type_client],
    queryFn: () => getTypeDocument(type_client),
  });
};

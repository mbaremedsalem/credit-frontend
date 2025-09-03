

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {   CLientT } from "../type";
import { BaseUrl } from "../../api/BaseUrl";

export const CLIENTS_KEY = ["client"];



async function getClients(client: string): Promise<CLientT[] | null> {
  if (!client) return null;

  const url = `${BaseUrl}api/comptes-particulier/?client=${client}`;
  try {
    const res = await axios.get(url, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data ? res.data : null;
  } catch (error) {
    return null;
  }
}

export const useGetClients = (client: string) => {
  return useQuery({
    queryKey: ["clients", client],
    queryFn: () => getClients(client),

  });
};



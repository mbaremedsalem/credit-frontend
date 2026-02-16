

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../../api/BaseUrl";
import { UserProcessus } from "./type";

export const NOTIFCATION_KEY = ["notification"];

async function getProcessus(): Promise<UserProcessus[]> {
  const url = `${BaseUrl}api/circuit-users/`;

  const res = await axios.get(url, {
    headers: { "Content-Type": "application/json" },
  });

  console.log("response users processus : ", res.data)

  return res.data;
}

export const useGetProcessusUsers = () => {
  return useQuery({
    queryKey: ["processus"],
    queryFn: () => getProcessus(),
  });
};


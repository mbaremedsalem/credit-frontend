

import { useQuery } from "@tanstack/react-query";
import { BaseUrl } from "../../api/BaseUrl";
import api from "../../Auth-Services/axios";

export const USERS_CONNECT_KEY = ["users-connect"];
export type UserData = {
    id: number;
    nom: string;
    prenom: string;
    phone: string;
    poit: number;
    username: string;
    email: string;
    address: string;
    role: string;
    post: string;
    image: string;
    agnece: string;
  };
  export const useGetUserRejeter = () => {
    async function getUsersConnect(username: {username:string}): Promise<UserData> {
        const res = await api.get(
            `${BaseUrl}auth/allUsers/?username=${username}`,
         
            {
              headers: { "Content-Type": "application/json" },
            }
          );
      console.log(" response data : ", res.data)
      return res.data;
    }
    return  (username:string) => {
      return useQuery({
        queryKey: ["users-connect", username],
        queryFn: () =>
            getUsersConnect({username}),
      });
    };
  };



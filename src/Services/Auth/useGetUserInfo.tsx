import { useQuery } from "@tanstack/react-query";

import api from "../../Auth-Services/axios";
export const userKey = ["user-key"]
export type UserInfo = {
    nom?: string;
    prenom?: string;
    phone?: string;
    username?: string;
    email?: string;
    address?: string;
    role?: string;
    post?: string;
    agnece?:string;
    image?: string | null | File;
  };

async function getMe():Promise<UserInfo>{
    try{
        const res = await api.get("auth/me/")
    console.log("res : ", res)
    return res.data
    }catch(error:any){
        if(error.response){
            console.log("error : ",error.response?.data?.detail)
            console.log("response :", error?.response?.status)
            
        }
        throw error
    }
}



export function getUserInfo(){
    return useQuery({
        queryKey:userKey,
        queryFn:()=>getMe()
    })
}
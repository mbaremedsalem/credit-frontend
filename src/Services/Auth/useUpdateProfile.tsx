



import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { UserInfo, userKey } from "./useGetUserInfo";
import api from "../../Auth-Services/axios";

export const useUpdateUser  = () => {
  const querClient = useQueryClient()
    async function updateuser (user : UserInfo){
        const formData = new FormData();
    formData.append("nom", user?.nom!);
    formData.append("prenom", user?.prenom!);
    formData.append("phone", user?.phone!);
    formData.append("username", user?.username!);
    formData.append("email", user?.email!);
    formData.append("address", user?.address!);
    formData.append("post", user?.post!);
    if (user.image) {
    formData.append("image", user?.image);
}
    const res = await api.put(`auth/me/update/`, formData)
    return res.data
    
    }
    return useMutation({
        mutationFn : updateuser,
        mutationKey : userKey,
        onSuccess :()=>{
            querClient.invalidateQueries({
                queryKey:userKey
            })
        message.success(" updated with successfuly");
        },
        onError:(err:any)=>{
        if(err.response.data.gender){
            return message.error(err.response.data.gender[0])
        } else if(err.response.data.phone){
           return message.error(err.response.data.phone[0])
        } else if(err.response.data.email){
            return message.error(err.response.data.email[0])
         }
        } 
    })
}
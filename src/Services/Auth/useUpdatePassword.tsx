import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import api from "../../Auth-Services/axios";



export type ModifierPassword = {
    old_password:string
    new_password:string
    confirm_password:string
}
export const useUpdatePassword  = () => {

    async function updatepassword (updatePass:ModifierPassword){
    const res = await api.put(`auth/update-password/`, updatePass)
    return res.data
    
    }
    return useMutation({
        mutationFn : updatepassword,
        onSuccess :()=>{
            
        message.success(" updated with successfuly");
        },
        onError:(err:any)=>{
            const messag1 = err?.response?.data?.error
        if(messag1){
            return message.error(messag1)
        } 
    
        } 
    })
}
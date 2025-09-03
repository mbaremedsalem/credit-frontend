import axios from "axios";
import { BaseUrl } from "../../api/BaseUrl";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";


export type ResetPasswordParams = {
    password?:string,
    confrimPassword:string,
    code:string
}


 async function reset(params : ResetPasswordParams){
    const res = await axios.post(`${BaseUrl}auth/reset_password/${params.code}`, {
        password:params.password,
        confirmPassword:params.confrimPassword
       
    },
        {
            headers: { "Content-Type": "application/json" },
        }
    )
    
    return res.data
}


export const useResetPassword = () => {
    return useMutation({
      mutationFn:  reset,
      onSuccess: () => {
        message.success(" Password reset successful You can log in ");
        
      },
      onError: (err:any) => {
        const errToken = err?.response?.data?.error
        if(errToken){
          message.error("Session Expired !")
          message.error("Please Try again !")
        } 
        const errorM = err?.response?.data?.detail
        console.log("errorM : ",errorM)
        if(errorM){
          message.error(errorM)
          message.error("token expired !")
        }
        console.log("err : ", errToken)
        
      },
    });
  };
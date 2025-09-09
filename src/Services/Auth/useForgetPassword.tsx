import axios from "axios";
import { BaseUrl } from "../../api/BaseUrl";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { enqueueSnackbar } from "notistack";

export type forgetPassword = {
  email: string;
};

async function reset(params: forgetPassword) {
  const res = await axios.post(
    `${BaseUrl}auth/forget_password/`,
    {
      email: params.email,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return res.data;
}

export const useForgetPassword = () => {
  return useMutation({
    mutationFn: reset,
    onSuccess: () => {
      message.success(
        "email sent to your email , please verify your email and reset your password !"
      );

      return enqueueSnackbar("E-mail envoyé avec succès !", {
        variant: "success",
      });
    },
    onError: (error: any) => {
      const errorM = error?.response?.data?.detail;
      if (errorM) {
        message.error(errorM);
      }
    },
  });
};





import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../../api/BaseUrl";

export type TokenType = {
  sso_token: string;
};

export const useConfirmToken = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  async function confirmtoken(token: TokenType) {
    
    const response = await axios.post(`${BaseUrl}auth/sso/`, token, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  return useMutation({
    mutationFn: confirmtoken,
    mutationKey: [],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [],
      });
    },
    onError: () => {
        navigate("/no-autorise")
        return window.location.href = "/no-autorise"
    },
  });
};

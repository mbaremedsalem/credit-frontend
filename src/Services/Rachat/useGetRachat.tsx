import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { BaseUrl } from "../../api/BaseUrl";
import { RachatResponse } from "./typeRachat";

export const RACHAT_KEY = ["rachat"];

async function getRachat(): Promise<RachatResponse> {
  try {

    const response = await axios.get<RachatResponse>(
      `${BaseUrl}api/rachat-credits/`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 secondes max
      }
    );

    // Vérification du status HTTP
    if (response.status !== 200) {
      throw new Error("Erreur lors de la récupération des rachats");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<any>;

      // Message backend si existe
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Erreur serveur";

      throw new Error(message);
    }

    throw new Error("Erreur inattendue");
  }
}

export const useGetRachat = () => {
  return useQuery<RachatResponse, Error>({
    queryKey: RACHAT_KEY,
    queryFn: getRachat,

    // 🔐 configuration sécurisée
    retry: 1, // évite spam serveur
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes en cache
    refetchOnWindowFocus: false,
  });
};

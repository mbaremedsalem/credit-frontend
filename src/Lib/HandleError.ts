import axios from "axios";

export const handleError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (Array.isArray(error.response?.data) && error.response?.data[0]) {
      return error.response.data[0]; 
    }
    if (typeof error.response?.data?.message === "string") {
      return error.response.data.message;
    }
    if (error.response?.status) {
      return `Error ${error.response.status}: ${error.response.statusText}`;
    }
    return "A network error occurred. Please check your connection.";
  } else if (error instanceof Error) {
    return error.message;
  }

  console.error("Unhandled error:", error);
  return "An unexpected error occurred. Please try again later.";
};
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../../api/BaseUrl";
import { NotificationType } from "./type";

export const NOTIFCATION_KEY = ["notification"];

async function getNotification(userid:string): Promise<NotificationType[]> {
  const params = new URLSearchParams();

  if (userid) params.append("userid", userid);
 

  const url = `${BaseUrl}api/notifications/?${params.toString()}`;

  const res = await axios.get(url, {
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
}

export const useGetNotifications = (userid: string) => {
  return useQuery({
    queryKey: ["notification", userid],
    queryFn: () => getNotification(userid),
  });
};

/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { config } from "@/config";
import { getValidToken } from "@/utills/getCookie";
import { logout } from "../auth";

export const GetStatistics = async () => {
  try {
    const authToken = await getValidToken();
    if (!authToken) {
      logout();
    }

    const res = await fetch(`${config.next_public_base_api}/users/dashboard`, {
      method: "GET",
      next: {
        tags: ["statistics"],
      },
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    });
    const result = await res.json();

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

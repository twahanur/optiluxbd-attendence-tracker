"use server";

import { config } from "@/config";
import { getValidToken } from "@/utills/getCookie";
import { logout } from "../auth";

export const GetStatistics = async () => {
  try {
    const authToken = await getValidToken();
    if (!authToken) {
      logout();
      return { error: "Authentication failed" };
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
    
    if (!res.ok) {
      throw new Error(`Failed to fetch statistics: ${res.status}`);
    }
    
    const result = await res.json();
    return result;
  } catch (error: unknown) {
    console.error("GetStatistics error:", error);
    return { error: error instanceof Error ? error.message : "Failed to fetch statistics" };
  }
};
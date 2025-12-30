"use server";

import { config } from "@/config";
import { getValidToken } from "@/service/auth/validToken";

export const GetStatistics = async () => {
  try {
    const authToken = await getValidToken();
    const res = await fetch(`${config.next_public_base_api}/users/dashboard`, {
      method: "GET",
      next: {
        tags: ["statistics"],
      },
      headers: {
        ...(authToken && { Authorization: authToken }),
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch statistics: ${res.status}`);
    }
    const result = await res.json();
    return result;
  } catch (error: unknown) {
    console.error("GetStatistics error:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to fetch statistics",
    };
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { config } from "@/config";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export type TLoginData = {
  email?: string;
  userId?: string;
  password: string;
};

export const loginUser = async (loginData: TLoginData) => {
  try {
    const res = await fetch(`${config.next_public_base_api}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    const result = await res.json();
    if (result?.success) {
      (await cookies()).set("authToken", result?.data?.token);
    }
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const getCurrentUser = async () => {
  const token = (await cookies()).get("authToken")?.value;
  let decodedData = null;
  if (token) {
    decodedData = await jwtDecode(token);
    return decodedData;
  } else {
    return null;
  }
};

export const logout = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    (await cookies()).delete("authToken");
    return { success: true, message: "Logout successful" };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { success: false, message: error?.message || "Logout failed" };
  }
};

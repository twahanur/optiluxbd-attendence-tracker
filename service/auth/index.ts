/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { config } from "@/config";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

type TLoginData = {
  email?: string;
  userId?: string;
  password: string;
};

export const loginUser = async (loginData: TLoginData) => {
  try {
    const res = await fetch(`${config.next_public_base_api}/auth/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    const result = await res.json();
    if (result?.success) {
      (await cookies()).set("token", result?.data?.refreshToken);
    }
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const getCurrentUser = async () => {
  const refreshToken = (await cookies()).get("token")?.value;
  let decodedData = null;
  if (refreshToken) {
    decodedData = await jwtDecode(refreshToken);
    return decodedData;
  } else {
    return null;
  }
};

"use server";
import { cookies } from "next/headers";

export const getValidToken = async (): Promise<string> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")!.value;

  return token as string;
};

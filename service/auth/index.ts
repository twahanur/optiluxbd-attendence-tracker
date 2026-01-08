/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { config } from "@/config";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

// ============================================
// TYPES
// ============================================

export type TLoginData = {
  email?: string;
  userId?: string;
  password: string;
};

export interface UserData {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "EMPLOYEE";
  employeeId?: string;
  section?: string;
  department?: string;
  designation?: string;
  phoneNumber?: string;
  address?: string;
  dateOfJoining?: string;
  isActive: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    user: UserData;
    token: string;
  };
  error?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetTokenRequest {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
}

export interface CreateEmployeeRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  section?: string;
  department: string;
  designation?: string;
  phoneNumber?: string;
  address?: string;
  dateOfJoining?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const getAuthToken = async () => {
  const token = (await cookies()).get("authToken")?.value;
  return token ? `Bearer ${token}` : null;
};

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message?: string; data?: T; error?: string }> => {
  try {
    const authToken = await getAuthToken();
    const res = await fetch(`${config.next_public_base_api}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: authToken }),
        ...options.headers,
      },
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Request failed",
      error: error?.message,
    };
  }
};

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

/**
 * Login user
 * POST /auth/login
 */
export const loginUser = async (loginData: TLoginData): Promise<LoginResponse> => {
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
    return {
      success: false,
      message: error?.message || "Login failed",
      error: error?.message,
    };
  }
};

/**
 * Get current user from JWT token
 */
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

/**
 * Logout user
 * POST /auth/logout
 */
export const logout = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Call backend logout endpoint
    const authToken = await getAuthToken();
    if (authToken) {
      await fetch(`${config.next_public_base_api}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      });
    }
    // Delete client-side cookie
    (await cookies()).delete("authToken");
    return { success: true, message: "Logout successful" };
  } catch (error: any) {
    // Still delete cookie even if backend call fails
    (await cookies()).delete("authToken");
    console.error("Logout error:", error);
    return { success: true, message: "Logged out" };
  }
};

// ============================================
// PASSWORD RESET ENDPOINTS
// ============================================

/**
 * Request password reset
 * POST /auth/forgot-password
 */
export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<{ success: boolean; message?: string; data?: { expiresAt: string } }> => {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Verify reset token
 * POST /auth/verify-reset-token
 */
export const verifyResetToken = async (
  data: VerifyResetTokenRequest
): Promise<{ success: boolean; message?: string; data?: { valid: boolean; email: string } }> => {
  return apiRequest("/auth/verify-reset-token", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Reset password with token
 * POST /auth/reset-password
 */
export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<{ success: boolean; message?: string }> => {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Change password (authenticated)
 * POST /auth/change-password
 */
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<{ success: boolean; message?: string }> => {
  return apiRequest("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// ============================================
// PROFILE ENDPOINTS
// ============================================

/**
 * Get user profile
 * GET /auth/profile
 */
export const getProfile = async (): Promise<{
  success: boolean;
  message?: string;
  data?: { user: UserData };
}> => {
  return apiRequest("/auth/profile", {
    method: "GET",
  });
};

/**
 * Update user profile
 * PUT /auth/profile
 */
export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<{ success: boolean; message?: string; data?: { user: UserData } }> => {
  return apiRequest("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// ============================================
// EMPLOYEE MANAGEMENT (ADMIN)
// ============================================

/**
 * Create employee
 * POST /auth/employees
 */
export const createEmployee = async (
  data: CreateEmployeeRequest
): Promise<{ success: boolean; message?: string; data?: { employee: UserData } }> => {
  return apiRequest("/auth/employees", {
    method: "POST",
    body: JSON.stringify(data),
  });
};


"use client";

import { apiGet, apiPut } from "@/lib/service-client";

// Profile Types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: "ADMIN" | "EMPLOYEE";
  department?: string;
  section?: string;
  phoneNumber?: string;
  address?: string;
  joinDate?: string;
  isActive: boolean;
  lastLogin?: string;
  profilePicture?: string | null;
  designation?: string;
  employeeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  profilePicture?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Raw API user shape returned by backend
interface ApiUser {
  id: string;
  email: string;
  username?: string;
  role: "ADMIN" | "EMPLOYEE";
  firstName?: string | null;
  lastName?: string | null;
  employeeId?: string | null;
  section?: string | null;
  department?: string | null;
  designation?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  dateOfJoining?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  lastLogin?: string | null;
}

type ApiProfileResponse = ApiResponse<{ profile: UserProfile }>;

const mapApiUserToProfile = (user: ApiUser): UserProfile => {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return {
    id: user.id,
    email: user.email,
    name: fullName || user.username || user.email,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    role: user.role,
    department: user.department ?? undefined,
    section: user.section ?? undefined,
    phoneNumber: user.phoneNumber ?? undefined,
    address: user.address ?? undefined,
    joinDate: user.dateOfJoining ?? undefined,
    isActive: user.isActive,
    lastLogin: user.lastLogin ?? undefined,
    profilePicture: null,
    designation: user.designation ?? undefined,
    employeeId: user.employeeId ?? undefined,
    createdAt: user.createdAt ?? undefined,
    updatedAt: user.updatedAt ?? undefined,
  };
};

/**
 * Get current user's profile
 * GET /auth/profile
 */
export async function getUserProfile(): Promise<ApiProfileResponse> {
  const response = await apiGet<{ user: ApiUser }>(
    "/auth/profile",
    {},
    "Failed to load profile"
  );

  if (response.success && response.data?.user) {
    return {
      ...response,
      data: { profile: mapApiUserToProfile(response.data.user) },
    };
  }

  return response as ApiProfileResponse;
}

/**
 * Update current user's profile
 * PUT /auth/profile
 */
export async function updateUserProfile(data: UpdateProfileRequest): Promise<ApiProfileResponse> {
  const response = await apiPut<{ user?: ApiUser; profile?: UserProfile }>(
    "/auth/profile",
    data,
    {},
    "Failed to update user profile"
  );

  if (response.success && response.data) {
    const user = response.data.user;
    const profile = response.data.profile;

    if (user) {
      return { ...response, data: { profile: mapApiUserToProfile(user) } };
    }

    if (profile) {
      return response as ApiProfileResponse;
    }
  }

  return response as ApiProfileResponse;
}

/**
 * Change current user's password
 * PUT /auth/change-password
 */
export async function changePassword(data: ChangePasswordRequest) {
  return apiPut(
    "/auth/change-password",
    data,
    {},
    "Failed to change password"
  );
}

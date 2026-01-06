"use client";

import { apiGet, apiPut } from "@/lib/service-client";

export interface PasswordRules {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecial: boolean;
  specialCharacters?: string;
}

export interface UsernameRules {
  minLength: number;
  maxLength: number;
  allowSpecial: boolean;
}

export interface RateLimitConfig {
  enabled: boolean;
  maxRequests: number;
  windowMs: number;
}

export interface SecuritySettingsBundle {
  passwordRules: PasswordRules;
  usernameRules: UsernameRules;
  rateLimiting: RateLimitConfig;
}

export interface RateLimitUpdateRequest {
  enabled?: boolean;
  maxRequests?: number;
  windowMinutes?: number;
}

export const getAllSecuritySettings = async () => {
  return apiGet<SecuritySettingsBundle>(
    "/admin/security-settings/all",
    {},
    "Failed to fetch security settings"
  );
};

export const getPasswordRules = async () => {
  return apiGet<PasswordRules>(
    "/admin/security-settings/password-rules",
    {},
    "Failed to fetch password rules"
  );
};

export const updatePasswordRules = async (rules: Partial<PasswordRules>) => {
  return apiPut(
    "/admin/security-settings/password-rules",
    rules,
    {},
    "Failed to update password rules"
  );
};

export const getUsernameRules = async () => {
  return apiGet<UsernameRules>(
    "/admin/security-settings/username-rules",
    {},
    "Failed to fetch username rules"
  );
};

export const updateUsernameRules = async (rules: Partial<UsernameRules>) => {
  return apiPut(
    "/admin/security-settings/username-rules",
    rules,
    {},
    "Failed to update username rules"
  );
};

export const getRateLimitConfig = async () => {
  return apiGet<RateLimitConfig>(
    "/admin/security-settings/rate-limit",
    {},
    "Failed to fetch rate limit config"
  );
};

export const updateRateLimitConfig = async (
  config: RateLimitUpdateRequest
) => {
  return apiPut(
    "/admin/security-settings/rate-limit",
    config,
    {},
    "Failed to update rate limit config"
  );
};

export const securitySettingsApi = {
  getAll: getAllSecuritySettings,
  getPasswordRules,
  updatePasswordRules,
  getUsernameRules,
  updateUsernameRules,
  getRateLimit: getRateLimitConfig,
  updateRateLimit: updateRateLimitConfig,
};

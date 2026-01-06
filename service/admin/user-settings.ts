"use client";

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/service-client";

// User Settings Service API
export interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  preventCommonPasswords: boolean;
  preventUserInfo: boolean;
  expirationDays: number;
  historyCount: number;
}

export interface RegistrationPolicy {
  allowSelfRegistration: boolean;
  requireEmailVerification: boolean;
  requireAdminApproval: boolean;
  allowedEmailDomains: string[];
  blockedEmailDomains: string[];
  defaultRole: string;
  autoActivateAccounts: boolean;
  requireInvitation: boolean;
}

export interface LockoutRules {
  enabled: boolean;
  maxFailedAttempts: number;
  lockoutDurationMinutes: number;
  resetFailedAttemptsAfterMinutes: number;
  notifyAdminOnLockout: boolean;
  allowSelfUnlock: boolean;
  progressiveDelay: boolean;
}

export interface PasswordValidationRequest {
  password: string;
  userInfo?: {
    email?: string;
    name?: string;
  };
}

export interface PasswordValidationResult {
  isValid: boolean;
  score: number;
  requirements: {
    minLength: boolean;
    maxLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSymbols: boolean;
    notCommon: boolean;
    notUserInfo: boolean;
  };
  suggestions: string[];
}

export interface CreateEmployeeRequest {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  employeeId: string;
  department: string;
  section?: string;
  designation?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  dateOfJoining?: string | null;
  isActive?: boolean;
  password: string;
  role: "ADMIN" | "EMPLOYEE" | "HR";
}

export interface EmployeeResponse {
  id: string;
  email: string;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  section: string | null;
  department: string;
  designation: string | null;
  phoneNumber: string | null;
  address: string | null;
  dateOfJoining: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
}

// Password Policy
export const getPasswordPolicy = async () => {
  return apiGet<{ passwordPolicy: PasswordPolicy }>(
    "/admin/user-settings/password-policy",
    {},
    "Failed to fetch password policy"
  );
};

export const updatePasswordPolicy = async (policy: PasswordPolicy) => {
  return apiPut(
    "/admin/user-settings/password-policy",
    policy,
    {},
    "Failed to update password policy"
  );
};

export const validatePassword = async (data: PasswordValidationRequest) => {
  return apiPost<PasswordValidationResult>(
    "/admin/user-settings/password-policy/validate",
    data,
    {},
    "Failed to validate password"
  );
};

// Registration Policy
export const getRegistrationPolicy = async () => {
  return apiGet<{ registrationPolicy: RegistrationPolicy }>(
    "/admin/user-settings/registration-policy",
    {},
    "Failed to fetch registration policy"
  );
};

export const updateRegistrationPolicy = async (policy: RegistrationPolicy) => {
  return apiPut(
    "/admin/user-settings/registration-policy",
    policy,
    {},
    "Failed to update registration policy"
  );
};

// Lockout Rules
export const getLockoutRules = async () => {
  return apiGet<{ lockoutRules: LockoutRules }>(
    "/admin/user-settings/lockout-rules",
    {},
    "Failed to fetch lockout rules"
  );
};

export const updateLockoutRules = async (rules: LockoutRules) => {
  return apiPut(
    "/admin/user-settings/lockout-rules",
    rules,
    {},
    "Failed to update lockout rules"
  );
};

// Employee Management
export const createEmployee = async (data: CreateEmployeeRequest) => {
  return apiPost<{
    employee: EmployeeResponse;
    temporaryPassword: string;
    resetRequired: boolean;
  }>("/auth/employees", data, {}, "Failed to create employee");
};

export interface EmployeePaginationResponse {
  employees: EmployeeResponse[];
  totalCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Get all employees
export const getAllEmployees = async (page: number = 1, limit: number = 100) => {
  return apiGet<EmployeePaginationResponse>(
    `/users/employees?page=${page}&limit=${limit}`,
    {},
    "Failed to fetch employees"
  );
};

// Update employee
export const updateEmployee = async (
  id: string,
  data: Partial<CreateEmployeeRequest>
) => {
  return apiPut(
    `/admin/employees/${id}`,
    data,
    {},
    "Failed to update employee"
  );
};

// Delete employee
export const deleteEmployee = async (id: string) => {
  return apiDelete(`/admin/employees/${id}`, {}, "Failed to delete employee");
};

// Session Settings
export interface SessionSettings {
  sessionTimeoutMinutes: number;
  idleTimeoutMinutes: number;
  maxConcurrentSessions: number;
  enforceOneSessionPerDevice: boolean;
  rememberMeDurationDays: number;
  refreshTokenEnabled: boolean;
  refreshTokenExpiryDays: number;
  requireReauthForSensitiveActions: boolean;
  logSessionActivity: boolean;
  sessionCookieSecure: boolean;
  sessionCookieHttpOnly: boolean;
  sessionCookieSameSite: 'strict' | 'lax' | 'none';
}

export const getSessionSettings = async () => {
  return apiGet<{ sessionSettings: SessionSettings }>(
    "/admin/user-settings/session-settings",
    {},
    "Failed to fetch session settings"
  );
};

export const updateSessionSettings = async (settings: Partial<SessionSettings>) => {
  return apiPut(
    "/admin/user-settings/session-settings",
    settings,
    {},
    "Failed to update session settings"
  );
};

// Profile Fields
export interface ProfileField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  visible: boolean;
  editable: boolean;
}

export interface ProfileFieldsConfig {
  fields: ProfileField[];
  allowCustomFields: boolean;
  maxCustomFields: number;
}

export const getProfileFields = async () => {
  return apiGet<{ profileFields: ProfileFieldsConfig }>(
    "/admin/user-settings/profile-fields",
    {},
    "Failed to fetch profile fields configuration"
  );
};

export const updateProfileFields = async (config: Partial<ProfileFieldsConfig>) => {
  return apiPut(
    "/admin/user-settings/profile-fields",
    config,
    {},
    "Failed to update profile fields configuration"
  );
};

// Password Requirements (for display)
export interface PasswordRequirement {
  key: string;
  label: string;
  met: boolean;
}

export const getPasswordRequirements = async () => {
  return apiGet<{ requirements: PasswordRequirement[]; policy: PasswordPolicy }>(
    "/admin/user-settings/password-requirements",
    {},
    "Failed to fetch password requirements"
  );
};

// Get all user settings at once
export interface AllUserSettings {
  passwordPolicy: PasswordPolicy;
  registrationPolicy: RegistrationPolicy;
  lockoutRules: LockoutRules;
  sessionSettings: SessionSettings;
  profileFields: ProfileFieldsConfig;
}

export const getAllUserSettings = async () => {
  return apiGet<AllUserSettings>(
    "/admin/user-settings/all",
    {},
    "Failed to fetch all user settings"
  );
};

// Reset all user settings to defaults
export const resetUserSettingsToDefaults = async () => {
  return apiPost(
    "/admin/user-settings/reset-defaults",
    {},
    {},
    "Failed to reset user settings to defaults"
  );
};

export const userSettingsApi = {
  getPasswordPolicy,
  updatePasswordPolicy,
  validatePassword,
  getRegistrationPolicy,
  updateRegistrationPolicy,
  getLockoutRules,
  updateLockoutRules,
  getSessionSettings,
  updateSessionSettings,
  getProfileFields,
  updateProfileFields,
  getPasswordRequirements,
  getAllUserSettings,
  resetUserSettingsToDefaults,
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
};

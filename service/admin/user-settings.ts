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
  name: string;
  department: string;
  section?: string;
  password: string;
  role: "ADMIN" | "EMPLOYEE" | "HR";
}

export interface EmployeeResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  department: string;
  section?: string;
  isActive: boolean;
  createdAt: string;
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
  }>("/admin/employees", data, {}, "Failed to create employee");
};

// Get all employees
export const getAllEmployees = async () => {
  return apiGet<{ employees: EmployeeResponse[]; total: number }>(
    "/admin/employees",
    {},
    "Failed to fetch employees"
  );
};

// Update employee
export const updateEmployee = async (
  id: number,
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
export const deleteEmployee = async (id: number) => {
  return apiDelete(`/admin/employees/${id}`, {}, "Failed to delete employee");
};

export const userSettingsApi = {
  getPasswordPolicy,
  updatePasswordPolicy,
  validatePassword,
  getRegistrationPolicy,
  updateRegistrationPolicy,
  getLockoutRules,
  updateLockoutRules,
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
};

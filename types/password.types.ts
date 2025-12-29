/**
 * Password policy types
 */
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

export interface UpdatePasswordPolicyRequest {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSymbols?: boolean;
  preventCommonPasswords?: boolean;
  preventUserInfo?: boolean;
  expirationDays?: number;
  historyCount?: number;
}
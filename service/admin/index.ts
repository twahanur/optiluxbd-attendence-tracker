// Re-export admin settings services
export {
  getAllSettings,
  getSettingsByCategory,
  createSetting,
  updateSetting,
  bulkUpdateSettings,
  deleteSetting,
  settingsApi,
} from "./settings";

export {
  getCompanyProfile,
  updateCompanyProfile,
  getWorkingHours,
  updateWorkingHours,
  getHolidays,
  addHoliday,
  updateHoliday,
  deleteHoliday,
  checkWorkingDay,
  companySettingsApi,
} from "./company-settings";

export {
  getSMTPConfig,
  updateSMTPConfig,
  testSMTPConnection,
  getAllTemplates,
  getTemplate,
  updateTemplate,
  getEmailSystemStatus,
  sendTestEmail,
  emailSettingsApi,
} from "./email-settings";

export {
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
  userSettingsApi,
} from "./user-settings";

export {
  getAllSecuritySettings,
  getPasswordRules,
  updatePasswordRules,
  getUsernameRules,
  updateUsernameRules,
  getRateLimitConfig,
  updateRateLimitConfig,
  securitySettingsApi,
} from "./security-settings";

export {
  getScheduleStatus,
  startSchedules,
  stopSchedules,
  reloadSchedules,
  getScheduleSettings,
  updateScheduleSettings,
  toggleSchedule,
  scheduleSettingsApi,
} from "./schedule-settings";

// Re-export server actions
export { GetStatistics } from "./statistics";

// Export types
export type {
  Setting,
  SettingsResponse,
  CategorySettingsResponse,
  CreateSettingRequest,
  BulkUpdateRequest,
} from "./settings";

export type {
  CompanyProfile,
  WorkingHours,
  Holiday,
  WorkingDayCheck,
} from "./company-settings";

export type {
  SMTPConfig,
  EmailTemplate,
  EmailTemplates,
  EmailSystemStatus,
  TestEmailRequest,
} from "./email-settings";

export type {
  PasswordPolicy,
  RegistrationPolicy,
  LockoutRules,
  PasswordValidationRequest,
  PasswordValidationResult,
  CreateEmployeeRequest,
  EmployeeResponse,
} from "./user-settings";

export type {
  PasswordRules,
  UsernameRules,
  RateLimitConfig,
  SecuritySettingsBundle,
  RateLimitUpdateRequest,
} from "./security-settings";

export type {
  ScheduleItem,
  ScheduleStatus,
  ScheduleSettings,
  ScheduleActionResult,
  ToggleResult,
} from "./schedule-settings";

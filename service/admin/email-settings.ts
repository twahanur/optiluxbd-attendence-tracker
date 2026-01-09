"use client";

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/service-client";

// ============================================
// TYPES
// ============================================

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass?: string;
  from?: string;
  fromEmail?: string;
  fromName?: string;
  isConfigured?: boolean;
}

export interface EmailTemplate {
  type?: string;
  subject: string;
  body?: string;
  htmlBody?: string;
  textBody?: string;
  variables?: string[];
  hasCustomTemplate?: boolean;
}

export interface EmailTemplates {
  attendanceReminder: EmailTemplate;
  passwordReset: EmailTemplate;
  dailyReport: EmailTemplate;
  weeklyReport: EmailTemplate;
  systemNotification: EmailTemplate;
}

export interface EmailSystemStatus {
  isConfigured: boolean;
  smtpStatus: "connected" | "disconnected" | "error";
  lastTestTime?: string;
  activeJobs: Array<{
    name: string;
    schedule: string;
    nextRun: string;
    status: "active" | "paused" | "error";
  }>;
  emailsSentToday: number;
  failedEmailsToday: number;
}

export interface TestEmailRequest {
  to: string;
  templateType?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface NotificationSchedule {
  timezone: string;
  dailyReminder: {
    enabled: boolean;
    cronExpression: string;
    subject?: string;
    description?: string;
  };
  weeklyReport: {
    enabled: boolean;
    cronExpression: string;
    subject?: string;
    description?: string;
  };
  endOfDay: {
    enabled: boolean;
    cronExpression: string;
    subject?: string;
    description?: string;
  };
  monthlyReport?: {
    enabled: boolean;
    cronExpression: string;
    subject?: string;
    description?: string;
  };
  birthdayGreetings?: {
    enabled: boolean;
    cronExpression: string;
    subject?: string;
    description?: string;
  };
  updatedAt?: string;
}

export interface AllEmailSettings {
  smtp: SMTPConfig;
  schedule: NotificationSchedule;
  templates: EmailTemplate[];
  status?: EmailSystemStatus;
}

// ============================================
// SMTP CONFIGURATION
// ============================================

/**
 * Get SMTP configuration
 * GET /admin/email-settings/smtp
 */
export const getSMTPConfig = async () => {
  return apiGet<SMTPConfig>(
    "/admin/email-settings/smtp",
    {},
    "Failed to fetch SMTP config"
  );
};

/**
 * Update SMTP configuration
 * PUT /admin/email-settings/smtp
 * Note: Password is optional - only send if updating the password
 */
export const updateSMTPConfig = async (smtpConfig: Partial<SMTPConfig>) => {
  return apiPut(
    "/admin/email-settings/smtp",
    smtpConfig,
    {},
    "Failed to update SMTP config"
  );
};

/**
 * Test SMTP connection
 * POST /admin/email-settings/smtp/test
 */
export const testSMTPConnection = async () => {
  return apiPost<{
    connectionStatus: string;
    testTime: string;
    serverResponse: string;
  }>(
    "/admin/email-settings/smtp/test",
    {},
    {},
    "Failed to test SMTP connection"
  );
};

// ============================================
// EMAIL TEMPLATES
// ============================================

/**
 * Get all email templates
 * GET /admin/email-settings/templates
 */
export const getAllTemplates = async () => {
  return apiGet<Record<string, EmailTemplate>>(
    "/admin/email-settings/templates",
    {},
    "Failed to fetch email templates"
  );
};

/**
 * Get specific template
 * GET /admin/email-settings/templates/:templateType
 */
export const getTemplate = async (templateType: string) => {
  return apiGet<{ template: EmailTemplate }>(
    `/admin/email-settings/templates/${templateType}`,
    {},
    `Failed to fetch ${templateType} template`
  );
};

/**
 * Update email template
 * PUT /admin/email-settings/templates/:templateType
 */
export const updateTemplate = async (
  templateType: string,
  template: Partial<EmailTemplate>
) => {
  return apiPut(
    `/admin/email-settings/templates/${templateType}`,
    template,
    {},
    `Failed to update ${templateType} template`
  );
};

/**
 * Delete email template (reverts to default)
 * DELETE /admin/email-settings/templates/:templateType
 */
export const deleteTemplate = async (templateType: string) => {
  return apiDelete(
    `/admin/email-settings/templates/${templateType}`,
    {},
    `Failed to delete ${templateType} template`
  );
};

/**
 * Initialize default templates
 * POST /admin/email-settings/templates/init-defaults
 */
export const initDefaultTemplates = async () => {
  return apiPost<{ templatesCreated: number }>(
    "/admin/email-settings/templates/init-defaults",
    {},
    {},
    "Failed to initialize default templates"
  );
};

// ============================================
// NOTIFICATION SCHEDULE
// ============================================

/**
 * Get notification schedule
 * GET /admin/email-settings/schedule
 */
export const getNotificationSchedule = async () => {
  return apiGet<{ schedule: NotificationSchedule }>(
    "/admin/email-settings/schedule",
    {},
    "Failed to fetch notification schedule"
  );
};

/**
 * Update notification schedule
 * PUT /admin/email-settings/schedule
 */
export const updateNotificationSchedule = async (
  schedule: Partial<NotificationSchedule>
) => {
  return apiPut<{ schedule: NotificationSchedule }>(
    "/admin/email-settings/schedule",
    schedule,
    {},
    "Failed to update notification schedule"
  );
};

// ============================================
// EMAIL SYSTEM
// ============================================

/**
 * Get email system status
 * GET /admin/email-settings/all (contains status)
 */
export const getEmailSystemStatus = async () => {
  const response = await getAllEmailSettings();
  if (response.success && response.data) {
    return {
      success: true,
      data: { emailSystem: response.data.status },
    };
  }
  return response;
};

/**
 * Send test email
 * POST /admin/email-settings/test
 */
export const sendTestEmail = async (testData: TestEmailRequest) => {
  return apiPost(
    "/admin/email-settings/test",
    testData,
    {},
    "Failed to send test email"
  );
};

/**
 * Get all email settings
 * GET /admin/email-settings/all
 */
export const getAllEmailSettings = async () => {
  return apiGet<AllEmailSettings>(
    "/admin/email-settings/all",
    {},
    "Failed to fetch all email settings"
  );
};

export interface SendCustomEmailRequest {
  userId: string;
  templateType: string;
  subject?: string;
  html?: string;
  variables?: Record<string, string>;
}

/**
 * Send custom email
 * POST /api/v1/email/send
 */
export const sentCustomEmail = async (
    emailData: SendCustomEmailRequest
) => {
  return apiPost(
    `/admin/email-settings/send`,
    emailData,
    {},
    `Failed to sent email using ${emailData} template`
  );
};

// ============================================
// EXPORT API OBJECT
// ============================================

export const emailSettingsApi = {
  // SMTP
  getSMTPConfig,
  updateSMTPConfig,
  testSMTPConnection,
  
  // Templates
  getAllTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
  initDefaultTemplates,
  
  // Schedule
  getNotificationSchedule,
  updateNotificationSchedule,
  
  // System
  getEmailSystemStatus,
  getSystemStatus: getEmailSystemStatus,
  sendTestEmail,
  getAllEmailSettings,
  sentCustomEmail
};

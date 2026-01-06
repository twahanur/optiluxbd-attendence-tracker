"use client";

import { apiGet, apiPost, apiPut } from "@/lib/service-client";

// Email Settings Service API
export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from?: string;
  fromEmail?: string;
  fromName?: string;
  isConfigured?: boolean;
}

export interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
  variables?: string[];
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
  email: string;
  subject: string;
  message: string;
}

// SMTP Configuration
export const getSMTPConfig = async () => {
  return apiGet<SMTPConfig>(
    "/settings/email/smtp",
    {},
    "Failed to fetch SMTP config"
  );
};

export const updateSMTPConfig = async (smtpConfig: SMTPConfig) => {
  return apiPut(
    "/settings/email/smtp",
    smtpConfig,
    {},
    "Failed to update SMTP config"
  );
};

export const testSMTPConnection = async () => {
  return apiPost<{
    connectionStatus: string;
    testTime: string;
    serverResponse: string;
  }>("/settings/email/smtp/test", {}, {}, "Failed to test SMTP connection");
};

// Email Templates
export const getAllTemplates = async () => {
  return apiGet<Record<string, EmailTemplate>>(
    "/settings/email/templates",
    {},
    "Failed to fetch email templates"
  );
};

export const getTemplate = async (templateName: string) => {
  return apiGet<EmailTemplate>(
    `/settings/email/templates/${templateName}`,
    {},
    `Failed to fetch ${templateName} template`
  );
};

export const updateTemplate = async (
  templateName: string,
  template: EmailTemplate
) => {
  return apiPut(
    `/settings/email/templates/${templateName}`,
    template,
    {},
    `Failed to update ${templateName} template`
  );
};

// Email System Status
export const getEmailSystemStatus = async () => {
  return apiGet<{ emailSystem: EmailSystemStatus }>(
    "/admin/email-status",
    {},
    "Failed to fetch email system status"
  );
};

// Test Email
export const sendTestEmail = async (testData: TestEmailRequest) => {
  return apiPost("/admin/test-email", testData, {}, "Failed to send test email");
};

// Notification Schedule
export interface NotificationSchedule {
  timezone: string;
  dailyReminder: {
    enabled: boolean;
    cronExpression: string;
    subject: string;
    description: string;
  };
  weeklyReport: {
    enabled: boolean;
    cronExpression: string;
    subject: string;
    description: string;
  };
  endOfDay: {
    enabled: boolean;
    cronExpression: string;
    subject: string;
    description: string;
  };
  monthlyReport: {
    enabled: boolean;
    cronExpression: string;
    subject: string;
    description: string;
  };
  birthdayGreetings: {
    enabled: boolean;
    cronExpression: string;
    subject: string;
    description: string;
  };
  updatedAt: string;
}

export const getNotificationSchedule = async () => {
  return apiGet<{ schedule: NotificationSchedule }>(
    "/admin/email-settings/schedule",
    {},
    "Failed to fetch notification schedule"
  );
};

export const updateNotificationSchedule = async (schedule: Partial<NotificationSchedule>) => {
  return apiPut<{ schedule: NotificationSchedule }>(
    "/admin/email-settings/schedule",
    schedule,
    {},
    "Failed to update notification schedule"
  );
};

// Get all email settings
export interface AllEmailSettings {
  smtp: SMTPConfig;
  schedule: NotificationSchedule;
  templates: EmailTemplate[];
  status: EmailSystemStatus;
}

export const getAllEmailSettings = async () => {
  return apiGet<AllEmailSettings>(
    "/admin/email-settings/all",
    {},
    "Failed to fetch all email settings"
  );
};

// Initialize default templates
export const initDefaultTemplates = async () => {
  return apiPost<{ templates: Record<string, EmailTemplate>; count: number }>(
    "/admin/email-settings/templates/init-defaults",
    {},
    {},
    "Failed to initialize default templates"
  );
};

export const emailSettingsApi = {
  getSMTPConfig,
  updateSMTPConfig,
  testSMTPConnection,
  getAllTemplates,
  getTemplate,
  updateTemplate,
  getEmailSystemStatus,
  getSystemStatus: getEmailSystemStatus,
  sendTestEmail,
  getNotificationSchedule,
  updateNotificationSchedule,
  getAllEmailSettings,
  initDefaultTemplates,
};

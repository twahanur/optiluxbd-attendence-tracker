"use client";

import { apiGet, apiPost, apiPut } from "@/lib/service-client";

// Email Settings Service API
export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  isConfigured?: boolean;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
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
  smtpStatus: 'connected' | 'disconnected' | 'error';
  lastTestTime?: string;
  activeJobs: Array<{
    name: string;
    schedule: string;
    nextRun: string;
    status: 'active' | 'paused' | 'error';
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
  return apiGet<{ smtp: SMTPConfig }>("/admin/settings/email/smtp", {}, "Failed to fetch SMTP config");
};

export const updateSMTPConfig = async (smtpConfig: SMTPConfig) => {
  return apiPut("/admin/settings/email/smtp", smtpConfig, {}, "Failed to update SMTP config");
};

export const testSMTPConnection = async () => {
  return apiPost<{
    connectionStatus: string; 
    testTime: string; 
    serverResponse: string;
  }>("/admin/settings/email/smtp/test", {}, {}, "Failed to test SMTP connection");
};


// Email Templates
export const getAllTemplates = async () => {
  return apiGet<{ 
    templates: Partial<EmailTemplates>; 
    count: number; 
  }>("/admin/settings/email/templates", {}, "Failed to fetch email templates");
};

export const getTemplate = async (templateName: keyof EmailTemplates) => {
  return apiGet<{ template: EmailTemplate }>(`/admin/settings/email/templates/${templateName}`, {}, `Failed to fetch ${templateName} template`);
};

export const updateTemplate = async (templateName: keyof EmailTemplates, template: EmailTemplate) => {
  return apiPut(`/admin/settings/email/templates/${templateName}`, template, {}, `Failed to update ${templateName} template`);
};

// Email System Status
export const getEmailSystemStatus = async () => {
  return apiGet<{ emailSystem: EmailSystemStatus }>("/admin/email-status", {}, "Failed to fetch email system status");
};

// Test Email
export const sendTestEmail = async (testData: TestEmailRequest) => {
  return apiPost("/admin/test-email", testData, {}, "Failed to send test email");
};

// API object for email settings
export const emailSettingsApi = {
  getSMTPConfig: getSMTPConfig,
  updateSMTPConfig: updateSMTPConfig,
  testSMTPConnection: testSMTPConnection,
  getAllTemplates: getAllTemplates,
  getTemplate: getTemplate,
  updateTemplate: updateTemplate,
  getSystemStatus: getEmailSystemStatus,
  sendTestEmail: sendTestEmail,
};

/**
 * Email system types
 */
export type EmailJobStatus = 'active' | 'inactive' | 'paused' | 'error';
export type SMTPStatus = 'connected' | 'disconnected' | 'error';

export interface EmailJob {
  name: string;
  schedule: string;
  nextRun: string;
  status: EmailJobStatus;
}

export interface EmailSystemStatus {
  isConfigured: boolean;
  smtpStatus: SMTPStatus;
  lastTestTime: string;
  activeJobs: EmailJob[];
  emailsSentToday: number;
  failedEmailsToday: number;
}

export interface TestEmailRequest {
  email: string;
  subject: string;
  message: string;
}

export interface TestEmailResponse {
  recipient: string;
  subject: string;
  sentAt: string;
}

/**
 * SMTP Settings types
 */
export interface SMTPSettings {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

/**
 * Email Template types
 */
export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  variables?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailTemplateRequest {
  name: string;
  subject: string;
  body: string;
  variables?: string[];
}

export interface UpdateEmailTemplateRequest {
  name?: string;
  subject?: string;
  body?: string;
  variables?: string[];
}
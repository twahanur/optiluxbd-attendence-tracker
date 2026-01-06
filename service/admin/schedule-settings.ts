"use client";

import { apiGet, apiPost, apiPut } from "@/lib/service-client";

// Schedule Settings Service API
export interface ScheduleItem {
  name: string;
  enabled: boolean;
  isRunning: boolean;
  lastRun: string | null;
  nextRun: string | null;
  cronExpression: string;
  successCount: number;
  failureCount: number;
}

export interface ScheduleStatus {
  isRunning: boolean;
  startedAt: string;
  schedules: {
    dailyReminder: ScheduleItem;
    weeklyReport: ScheduleItem;
    endOfDay: ScheduleItem;
    monthlyReport: ScheduleItem;
  };
  timezone: string;
}

export interface ScheduleSettings {
  timezone: string;
  dailyReminder: {
    enabled: boolean;
    cronExpression: string;
    subject: string;
  };
  weeklyReport: {
    enabled: boolean;
    cronExpression: string;
    subject: string;
  };
  endOfDay: {
    enabled: boolean;
    cronExpression: string;
    subject: string;
  };
  monthlyReport: {
    enabled: boolean;
    cronExpression: string;
    subject: string;
  };
  updatedAt: string;
}

export interface ScheduleActionResult {
  isRunning: boolean;
  startedAt?: string;
  stoppedAt?: string;
  reloadedAt?: string;
  schedulesStarted?: string[];
  schedulesStopped?: string[];
  schedulesReloaded?: string[];
  message: string;
}

export interface ToggleResult {
  scheduleType: string;
  enabled: boolean;
  updatedAt: string;
  message: string;
}

// Get schedule status
export const getScheduleStatus = async () => {
  return apiGet<{ status: ScheduleStatus }>(
    "/admin/schedule-settings/status",
    {},
    "Failed to fetch schedule status"
  );
};

// Start all schedules
export const startSchedules = async () => {
  return apiPost<ScheduleActionResult>(
    "/admin/schedule-settings/start",
    {},
    {},
    "Failed to start schedules"
  );
};

// Stop all schedules
export const stopSchedules = async () => {
  return apiPost<ScheduleActionResult>(
    "/admin/schedule-settings/stop",
    {},
    {},
    "Failed to stop schedules"
  );
};

// Reload schedules with current settings
export const reloadSchedules = async () => {
  return apiPost<ScheduleActionResult>(
    "/admin/schedule-settings/reload",
    {},
    {},
    "Failed to reload schedules"
  );
};

// Get schedule settings
export const getScheduleSettings = async () => {
  return apiGet<{ settings: ScheduleSettings }>(
    "/admin/schedule-settings/settings",
    {},
    "Failed to fetch schedule settings"
  );
};

// Update schedule settings
export const updateScheduleSettings = async (settings: Partial<ScheduleSettings>) => {
  return apiPut<{ settings: ScheduleSettings }>(
    "/admin/schedule-settings/settings",
    settings,
    {},
    "Failed to update schedule settings"
  );
};

// Toggle specific schedule
export const toggleSchedule = async (scheduleType: string, enabled: boolean) => {
  return apiPut<ToggleResult>(
    `/admin/schedule-settings/toggle/${scheduleType}`,
    { enabled },
    {},
    `Failed to toggle ${scheduleType} schedule`
  );
};

export const scheduleSettingsApi = {
  getStatus: getScheduleStatus,
  start: startSchedules,
  stop: stopSchedules,
  reload: reloadSchedules,
  getSettings: getScheduleSettings,
  updateSettings: updateScheduleSettings,
  toggle: toggleSchedule,
};

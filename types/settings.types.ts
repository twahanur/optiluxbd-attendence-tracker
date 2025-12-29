import { BaseEntity } from './api.types';

/**
 * Settings types
 */
export interface Setting extends BaseEntity {
  key: string;
  value: string;
  category: string;
  description: string;
}

export interface CreateSettingRequest {
  key: string;
  value: string;
  category: string;
  description?: string;
}

export interface UpdateSettingRequest {
  value?: string;
  category?: string;
  description?: string;
}

export interface BulkUpdateSettingsRequest {
  settings: Array<{
    key: string;
    value: string;
  }>;
}

export interface SettingsResponse {
  settings: Setting[];
  total: number;
  categories: string[];
}

/**
 * Company Settings types
 */
export interface CompanySettings {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone: string;
}

/**
 * Working Hours types
 */
export interface WorkingHours {
  day: string;
  startTime: string;
  endTime: string;
  isWorkingDay: boolean;
}

/**
 * Holiday types
 */
export interface Holiday {
  id: number;
  name: string;
  date: string;
  isRecurring: boolean;
  description?: string;
}
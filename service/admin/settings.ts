"use client";

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/service-client";

// Settings Service API
export interface Setting {
  id: number;
  key: string;
  value: string;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsResponse {
  success: boolean;
  message: string;
  data: {
    settings: Setting[];
    total: number;
    categories: string[];
  };
  timestamp: string;
}

export interface CategorySettingsResponse {
  success: boolean;
  message: string;
  data: {
    category: string;
    settings: Omit<Setting, 'id' | 'createdAt' | 'updatedAt'>[];
    count: number;
  };
  timestamp: string;
}

export interface CreateSettingRequest {
  key: string;
  value: string;
  category: string;
  description?: string;
}

export interface BulkUpdateRequest {
  settings: Array<{
    key: string;
    value: string;
    category: string;
  }>;
}



// Get all settings
export const getAllSettings = async () => {
  return apiGet<SettingsResponse>("/admin/settings", {}, "Failed to fetch settings");
};
// Get settings by category
export const getSettingsByCategory = async (category: string) => {
  return apiGet<CategorySettingsResponse>(`/admin/settings/category/${category}`, {}, `Failed to fetch ${category} settings`);
};

// Create new setting
export const createSetting = async (data: CreateSettingRequest) => {
  return apiPost("/admin/settings", data, {}, "Failed to create setting");
};

// Update setting
export const updateSetting = async (key: string, value: string) => {
  return apiPut(`/admin/settings/${key}`, { value }, {}, "Failed to update setting");
};

// Bulk update settings
export const bulkUpdateSettings = async (data: BulkUpdateRequest) => {
  return apiPut("/admin/settings/bulk", data, {}, "Failed to bulk update settings");
};

// Delete setting
export const deleteSetting = async (key: string) => {
  return apiDelete(`/admin/settings/${key}`, {}, "Failed to delete setting");
};

// API object for settings
export const settingsApi = {
  getAll: getAllSettings,
  getByCategory: getSettingsByCategory,
  create: createSetting,
  update: updateSetting,
  bulkUpdate: bulkUpdateSettings,
  delete: deleteSetting,
};

"use server";

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/service-client";

// Company Settings Service API
export interface CompanyProfile {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  industry?: string;
  description?: string;
  logo?: string;
}

export interface WorkingHours {
  monday: { start: string; end: string; isWorkingDay: boolean };
  tuesday: { start: string; end: string; isWorkingDay: boolean };
  wednesday: { start: string; end: string; isWorkingDay: boolean };
  thursday: { start: string; end: string; isWorkingDay: boolean };
  friday: { start: string; end: string; isWorkingDay: boolean };
  saturday: { start: string; end: string; isWorkingDay: boolean };
  sunday: { start: string; end: string; isWorkingDay: boolean };
  timezone: string;
  lunchBreakStart: string;
  lunchBreakEnd: string;
}

export interface Holiday {
  id?: number;
  name: string;
  date: string;
  type: 'public' | 'private';
  description?: string;
}

export interface WorkingDayCheck {
  date: string;
  isWorkingDay: boolean;
  dayOfWeek: string;
  isHoliday: boolean;
  holidayInfo?: Holiday | null;
  workingHours?: { start: string; end: string };
}

// Company Profile
export const getCompanyProfile = async () => {
  return apiGet<{ profile: CompanyProfile }>("/admin/settings/company/profile", {}, "Failed to fetch company profile");
};

export const updateCompanyProfile = async (profile: CompanyProfile) => {
  return apiPut("/admin/settings/company/profile", profile, {}, "Failed to update company profile");
};

// Working Hours
export const getWorkingHours = async () => {
  return apiGet<{ workingHours: WorkingHours }>("/admin/settings/company/working-hours", {}, "Failed to fetch working hours");
};

export const updateWorkingHours = async (workingHours: WorkingHours) => {
  return apiPut("/admin/settings/company/working-hours", workingHours, {}, "Failed to update working hours");
};

// Holidays
export const getHolidays = async (year?: number) => {
  const endpoint = year ? `/admin/settings/company/holidays?year=${year}` : `/admin/settings/company/holidays`;
  return apiGet<{ holidays: Holiday[]; total: number; year: number }>(endpoint, {}, "Failed to fetch holidays");
};

export const addHoliday = async (holiday: Omit<Holiday, 'id'>) => {
  return apiPost("/admin/settings/company/holidays", holiday, {}, "Failed to add holiday");
};

export const updateHoliday = async (id: number, holiday: Partial<Holiday>) => {
  return apiPut(`/admin/settings/company/holidays/${id}`, holiday, {}, "Failed to update holiday");
};

export const deleteHoliday = async (id: number) => {
  return apiDelete(`/admin/settings/company/holidays/${id}`, {}, "Failed to delete holiday");
};

// Working Day Check
export const checkWorkingDay = async (date: string) => {
  return apiGet<WorkingDayCheck>(`/admin/settings/company/working-day/${date}`, {}, "Failed to check working day");
};
// API object for company settings
export const companySettingsApi = {
  getProfile: getCompanyProfile,
  updateProfile: updateCompanyProfile,
  getWorkingHours: getWorkingHours,
  updateWorkingHours: updateWorkingHours,
  getHolidays: getHolidays,
  addHoliday: addHoliday,
  updateHoliday: updateHoliday,
  deleteHoliday: deleteHoliday,
  checkWorkingDay: checkWorkingDay,
};
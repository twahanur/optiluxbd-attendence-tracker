// Re-export all types for easy importing
export * from './api.types';
export * from './settings.types';
export * from './email.types';
export * from './password.types';
export * from './user.types';

// Type guards
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

export function isValidDay(day: string): boolean {
  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return validDays.includes(day.toLowerCase());
}
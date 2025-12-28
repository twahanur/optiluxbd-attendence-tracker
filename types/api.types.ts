/**
 * Common API response types
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Standard error response
 */
export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  timestamp: string;
}

/**
 * Standard success response
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
  timestamp: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}
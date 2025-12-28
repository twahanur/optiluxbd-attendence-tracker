import { NextResponse } from 'next/server';
import { ApiResponse, SuccessResponse, ErrorResponse, ValidationResult } from '@/types';

/**
 * Creates a standardized successful response
 */
export function createSuccessResponse<T = unknown>(
  message: string,
  data?: T,
  status: number = 200
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  }, { status });
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  message: string,
  error?: string,
  status: number = 500
): NextResponse<ErrorResponse> {
  return NextResponse.json({
    success: false,
    message,
    error,
    timestamp: new Date().toISOString()
  }, { status });
}

/**
 * Creates a validation error response
 */
export function createValidationError(
  message: string,
  errors?: string[]
): NextResponse<ErrorResponse> {
  return createErrorResponse(
    message, 
    errors?.join(', '), 
    400
  );
}

/**
 * Creates a not found error response
 */
export function createNotFoundError(
  message: string = 'Resource not found'
): NextResponse<ErrorResponse> {
  return createErrorResponse(message, undefined, 404);
}

/**
 * Creates a conflict error response
 */
export function createConflictError(
  message: string,
  error?: string
): NextResponse<ErrorResponse> {
  return createErrorResponse(message, error, 409);
}

/**
 * Higher-order function to wrap API handlers with consistent error handling
 */
export function withErrorHandling<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>,
  defaultErrorMessage: string = 'An error occurred'
) {
  return async (...args: T): Promise<NextResponse<ApiResponse> | R> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('API Error:', error);
      return createErrorResponse(
        defaultErrorMessage,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };
}

/**
 * Validates required fields in request body
 */
export function validateRequiredFields(
  body: Record<string, unknown>,
  requiredFields: string[]
): ValidationResult {
  const errors = requiredFields
    .filter(field => 
      body[field] === undefined || 
      body[field] === null || 
      body[field] === ''
    )
    .map(field => `${field} is required`);
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Extracts query parameters from NextRequest
 */
export function getQueryParams(request: Request): URLSearchParams {
  const url = new URL(request.url);
  return url.searchParams;
}

/**
 * Safely parses JSON from request body
 */
export async function parseRequestBody<T = unknown>(request: Request): Promise<T | null> {
  try {
    const body = await request.json();
    return body;
  } catch {
    return null;
  }
}

/**
 * Validates numeric field within range
 */
export function validateNumericRange(
  value: unknown,
  fieldName: string,
  min?: number,
  max?: number
): ValidationResult {
  if (typeof value !== 'number') {
    return { 
      isValid: false, 
      errors: [`${fieldName} must be a number`]
    };
  }
  
  const errors: string[] = [];
  
  if (min !== undefined && value < min) {
    errors.push(`${fieldName} must be at least ${min}`);
  }
  
  if (max !== undefined && value > max) {
    errors.push(`${fieldName} must be at most ${max}`);
  }
  
  return { 
    isValid: errors.length === 0,
    errors
  };
}
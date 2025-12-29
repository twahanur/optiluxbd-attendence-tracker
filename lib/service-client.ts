/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { config } from "@/config";

interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    // Client-side: get from document.cookie
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
    return authCookie ? authCookie.split('=')[1] : null;
  }
  return null;
};

// Generic API call function
export const apiCall = async <T = any>(
  endpoint: string,
  options: ApiCallOptions = {},
  errorMessage: string = "API call failed"
): Promise<ApiResponse<T>> => {
  try {
    const token = getAuthToken();
    const {
      method = 'GET',
      body,
      headers = {},
      cache,
      next
    } = options;

    const requestConfig: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      ...(cache && { cache }),
      ...(next && { next }),
    };

    // Add body for POST/PUT requests
    if (body && (method === 'POST' || method === 'PUT')) {
      requestConfig.body = JSON.stringify(body);
    }

    const res = await fetch(`${config.next_public_base_api}${endpoint}`, requestConfig);

    // Handle non-JSON responses (like blobs for PDF downloads)
    const contentType = res.headers.get("content-type");
    if (contentType && !contentType.includes("application/json")) {
      if (contentType.includes("application/pdf")) {
        const blob = await res.blob();
        return {
          success: true,
          data: blob as T,
        };
      }
    }

    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    return {
      success: false,
      message: error?.message || errorMessage,
    };
  }
};

// Convenience methods for different HTTP verbs
export const apiGet = <T = any>(
  endpoint: string,
  options: Omit<ApiCallOptions, 'method'> = {},
  errorMessage?: string
) => apiCall<T>(endpoint, { ...options, method: 'GET' }, errorMessage);

export const apiPost = <T = any>(
  endpoint: string,
  body?: any,
  options: Omit<ApiCallOptions, 'method' | 'body'> = {},
  errorMessage?: string
) => apiCall<T>(endpoint, { ...options, method: 'POST', body }, errorMessage);

export const apiPut = <T = any>(
  endpoint: string,
  body?: any,
  options: Omit<ApiCallOptions, 'method' | 'body'> = {},
  errorMessage?: string
) => apiCall<T>(endpoint, { ...options, method: 'PUT', body }, errorMessage);

export const apiDelete = <T = any>(
  endpoint: string,
  options: Omit<ApiCallOptions, 'method'> = {},
  errorMessage?: string
) => apiCall<T>(endpoint, { ...options, method: 'DELETE' }, errorMessage);
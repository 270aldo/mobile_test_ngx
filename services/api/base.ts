/**
 * Base API utilities
 *
 * Shared error handling and utilities for all API services
 */

import { PostgrestError } from '@supabase/supabase-js';

/**
 * API Error class for consistent error handling
 */
export class ApiError extends Error {
  code: string;
  details: string | null;
  hint: string | null;

  constructor(error: PostgrestError) {
    super(error.message);
    this.name = 'ApiError';
    this.code = error.code;
    this.details = error.details;
    this.hint = error.hint;
  }

  /**
   * Check if error is a "not found" error
   */
  get isNotFound(): boolean {
    return this.code === 'PGRST116';
  }

  /**
   * Check if error is an RLS policy violation
   */
  get isUnauthorized(): boolean {
    return this.code === '42501' || this.code === 'PGRST301';
  }
}

/**
 * Handle Supabase query result
 * Throws ApiError if there's an error, otherwise returns data
 */
export function handleQueryResult<T>(
  data: T | null,
  error: PostgrestError | null
): T {
  if (error) {
    throw new ApiError(error);
  }
  if (data === null) {
    throw new Error('Query returned null data without error');
  }
  return data;
}

/**
 * Handle Supabase query result that may return no rows
 * Returns null for "no rows" error, throws for other errors
 */
export function handleQueryResultOrNull<T>(
  data: T | null,
  error: PostgrestError | null
): T | null {
  if (error) {
    // PGRST116 = no rows returned for .single() query
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new ApiError(error);
  }
  return data;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get ISO day of week (1 = Monday, 7 = Sunday)
 */
export function getISODayOfWeek(date: Date = new Date()): number {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

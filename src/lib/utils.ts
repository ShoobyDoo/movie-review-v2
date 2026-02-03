import type { PostgrestError } from '@supabase/supabase-js';
import type { DbResponse } from './types';

/**
 * Custom database error class
 */
export class DatabaseError extends Error {
  public originalError?: PostgrestError;
  public code?: string;

  constructor(
    message: string,
    originalError?: PostgrestError,
    code?: string
  ) {
    super(message);
    this.name = 'DatabaseError';
    this.originalError = originalError;
    this.code = code;
  }
}

/**
 * Unwraps a database response and throws if there's an error
 * @param response Database response object
 * @returns The data from the response
 * @throws DatabaseError if response contains an error
 */
export function unwrapResponse<T>(response: DbResponse<T>): T {
  if (response.error) {
    throw new DatabaseError(
      response.error.message,
      response.error,
      response.error.code
    );
  }

  if (response.data === null) {
    throw new DatabaseError('No data returned from database');
  }

  return response.data;
}

/**
 * Checks if an error is a unique constraint violation
 * @param error PostgrestError object
 * @returns true if error is a unique constraint violation
 */
export function isUniqueConstraintError(error: PostgrestError): boolean {
  return error.code === '23505';
}

/**
 * Checks if an error is a not found error
 * @param error PostgrestError object
 * @returns true if error indicates resource not found
 */
export function isNotFoundError(error: PostgrestError): boolean {
  return error.code === 'PGRST116';
}

/**
 * Checks if an error is a foreign key constraint violation
 * @param error PostgrestError object
 * @returns true if error is a foreign key violation
 */
export function isForeignKeyError(error: PostgrestError): boolean {
  return error.code === '23503';
}

/**
 * API Services Index
 *
 * Re-exports all API services for convenient imports
 */

export { profileApi } from './profile';
export { seasonApi } from './season';
export { workoutApi } from './workout';
export { chatApi } from './chat';
export { checkinApi } from './checkin';
export { coachApi } from './coach';

// Re-export error handling utilities
export { ApiError, handleQueryResult, handleQueryResultOrNull } from './base';

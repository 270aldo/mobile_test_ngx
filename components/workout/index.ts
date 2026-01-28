/**
 * Workout Player Components
 *
 * Components for the workout execution flow:
 * - SetLogger: Modal for logging individual sets
 * - RestTimer: Countdown timer between sets
 * - WorkoutSummary: Post-workout completion screen
 */

export { SetLogger } from './SetLogger';
export type { SetLogData } from './SetLogger';

export { RestTimer } from './RestTimer';

export { WorkoutSummary } from './WorkoutSummary';
export type { WorkoutStats, WorkoutSummaryData } from './WorkoutSummary';

/**
 * NGX GENESIS - Asset Management
 *
 * Centralized asset paths and helpers for consistent image/video loading
 * across the app. Includes fallbacks for development.
 */

import { ImageSource } from 'expo-image';

// =============================================================================
// WORKOUT TYPE MAPPING
// =============================================================================

export type WorkoutType =
  | 'upper_push'
  | 'upper_pull'
  | 'lower_squat'
  | 'lower_deadlift'
  | 'full_body'
  | 'conditioning'
  | 'recovery';

// =============================================================================
// HERO IMAGES
// =============================================================================

/**
 * Hero background images for workout cards
 * Used on Home screen mission card and workout preview
 */
export const heroImages: Record<WorkoutType, ImageSource | null> = {
  upper_push: null, // Will be: require('@/assets/images/hero/hero_upper_push.jpg')
  upper_pull: null, // Will be: require('@/assets/images/hero/hero_upper_pull.jpg')
  lower_squat: null, // Will be: require('@/assets/images/hero/hero_lower_squat.jpg')
  lower_deadlift: null, // Will be: require('@/assets/images/hero/hero_lower_deadlift.jpg')
  full_body: null, // Will be: require('@/assets/images/hero/hero_full_body.jpg')
  conditioning: null, // Will be: require('@/assets/images/hero/hero_conditioning.jpg')
  recovery: null, // Placeholder for now
};

/**
 * Get hero image for a workout type
 * Falls back to existing assets during development
 */
export function getHeroImage(type: WorkoutType | string): ImageSource | undefined {
  // Map common workout titles to types
  const typeMap: Record<string, WorkoutType> = {
    'upper push': 'upper_push',
    'upper pull': 'upper_pull',
    'lower squat': 'lower_squat',
    'lower deadlift': 'lower_deadlift',
    'full body': 'full_body',
    'conditioning': 'conditioning',
    'cardio': 'conditioning',
    'recovery': 'recovery',
    'hipertrofia': 'upper_push', // Default for hypertrophy
    'fuerza': 'lower_squat', // Default for strength
  };

  const normalizedType = type.toLowerCase().replace(/[-_]/g, ' ');
  const mappedType = typeMap[normalizedType] || (type as WorkoutType);

  // Check if we have the real image
  const heroImage = heroImages[mappedType];
  if (heroImage) {
    return heroImage;
  }

  // Fallback to existing assets during development
  // These are already in the assets folder
  const fallbackImages: Record<string, ImageSource> = {
    upper_push: require('@/assets/ngx_gym_lift.png'),
    upper_pull: require('@/assets/ngx_pullup.png'),
    lower_squat: require('@/assets/ngx_gym_lift.png'),
    lower_deadlift: require('@/assets/ngx_gym_lift.png'),
    full_body: require('@/assets/ngx_gym_lift.png'),
    conditioning: require('@/assets/ngx_wearable.png'),
    recovery: require('@/assets/ngx_recovery_light.png'),
  };

  return fallbackImages[mappedType] || fallbackImages.upper_push;
}

// =============================================================================
// AVATARS
// =============================================================================

export const avatars = {
  genesis: null as ImageSource | null, // Will be: require('@/assets/images/avatars/genesis_avatar.png')
  genesisThinking: null as ImageSource | null, // Animated version
  coachMale: null as ImageSource | null,
  coachFemale: null as ImageSource | null,
};

/**
 * Get GENESIS avatar
 * Returns null during development (component should show fallback icon)
 */
export function getGenesisAvatar(): ImageSource | null {
  return avatars.genesis;
}

/**
 * Get coach avatar by gender preference
 */
export function getCoachAvatar(gender: 'male' | 'female' = 'male'): ImageSource | null {
  return gender === 'male' ? avatars.coachMale : avatars.coachFemale;
}

// =============================================================================
// EMPTY STATES
// =============================================================================

export const emptyStates = {
  workouts: null as ImageSource | null,
  messages: null as ImageSource | null,
  progress: null as ImageSource | null,
  coachNotes: null as ImageSource | null,
};

export type EmptyStateType = keyof typeof emptyStates;

/**
 * Get empty state illustration
 */
export function getEmptyState(type: EmptyStateType): ImageSource | null {
  return emptyStates[type];
}

// =============================================================================
// BADGES
// =============================================================================

export const badges = {
  firstWorkout: null as ImageSource | null,
  weekStreak: null as ImageSource | null,
  monthComplete: null as ImageSource | null,
  prSet: null as ImageSource | null,
  consistency: null as ImageSource | null,
  seasonComplete: null as ImageSource | null,
};

export type BadgeType = keyof typeof badges;

/**
 * Get achievement badge image
 */
export function getBadge(type: BadgeType): ImageSource | null {
  return badges[type];
}

// =============================================================================
// EXERCISE DEMOS
// =============================================================================

/**
 * Exercise demo videos/GIFs
 * Mapped by exercise slug
 */
export const exerciseDemos: Record<string, ImageSource | null> = {
  'bench-press': null,
  'overhead-press': null,
  'incline-db-press': null,
  'dips': null,
  'pull-up': null,
  'barbell-row': null,
  'cable-row': null,
  'face-pull': null,
  'squat': null,
  'deadlift': null,
  'rdl': null,
  'leg-press': null,
  'lunges': null,
  'leg-curl': null,
  'plank': null,
  'cable-crunch': null,
  'lateral-raise': null,
  'bicep-curl': null,
  'tricep-pushdown': null,
  'calf-raise': null,
};

/**
 * Get exercise demo by name or slug
 */
export function getExerciseDemo(nameOrSlug: string): ImageSource | null {
  const slug = nameOrSlug
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return exerciseDemos[slug] || null;
}

// =============================================================================
// VIDEOS
// =============================================================================

export const videos = {
  restTimerBg: null as { uri: string } | number | null,
  gymAmbient: null as { uri: string } | number | null,
  abstractParticles: null as { uri: string } | number | null,
};

export type VideoType = keyof typeof videos;

/**
 * Get background video source
 */
export function getVideo(type: VideoType): { uri: string } | number | null {
  return videos[type];
}

// =============================================================================
// BLURHASHES
// =============================================================================

/**
 * Pre-computed blurhashes for different content types
 * These provide smooth loading placeholders
 */
export const blurhashes = {
  // Dark fitness aesthetic
  hero: '|14.w*IU0K9F00_3-;%M00~q4nofWBofWBWBofWBj[',
  // Very dark, almost black
  dark: '|00000fQfQfQfQfQfQfQfQfQ~qfQfQfQfQfQfQfQfQj[',
  // Avatar placeholder
  avatar: '|00000fQfQfQfQfQ~qfQfQfQ',
  // Workout/gym
  workout: '|25RZrxu-;%M~qIU00%M%M00',
  // Violet tinted
  violet: '|13YIp?b00Rj00_3-;-p00~q4nM{V@j[WBj[WBj[j[',
} as const;

export type BlurhashType = keyof typeof blurhashes;

/**
 * Get blurhash for content type
 */
export function getBlurhash(type: BlurhashType = 'dark'): string {
  return blurhashes[type];
}

// =============================================================================
// ASSET REGISTRY HELPERS
// =============================================================================

/**
 * Check if all required assets are loaded
 * Useful for splash screen logic
 */
export function areAssetsReady(): boolean {
  // Check critical assets
  const criticalAssets = [
    heroImages.upper_push,
    avatars.genesis,
  ];

  return criticalAssets.every((asset) => asset !== null);
}

/**
 * Get count of loaded vs total assets
 * Useful for loading progress
 */
export function getAssetLoadProgress(): { loaded: number; total: number } {
  const allAssets = [
    ...Object.values(heroImages),
    ...Object.values(avatars),
    ...Object.values(emptyStates),
    ...Object.values(badges),
  ];

  const loaded = allAssets.filter((asset) => asset !== null).length;
  return { loaded, total: allAssets.length };
}

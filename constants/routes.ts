export const coachCtaRoutes = [
  '/(tabs)/train',
  '/(tabs)/nourish',
  '/(tabs)/mind',
  '/(tabs)/video',
  '/(tabs)/chat',
  '/(tabs)/progress',
  '/(tabs)/profile',
  '/nutrition/log',
  '/nutrition/supplements',
  '/mindfulness/visualization',
] as const;

export type CoachCtaRoute = (typeof coachCtaRoutes)[number];

export const isCoachCtaRoute = (route: string): route is CoachCtaRoute =>
  (coachCtaRoutes as readonly string[]).includes(route);

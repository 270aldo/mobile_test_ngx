import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Hexagon, Bell } from 'lucide-react-native';
import { colors, spacing, typography, touchTarget } from '@/constants/theme';

interface DailyHubHeaderProps {
  /** User display name */
  displayName?: string;
  /** Current season number */
  seasonNumber?: number;
  /** Current week in season */
  weekNumber?: number;
  /** Season name/goal */
  seasonName?: string;
  /** Whether there are unread notifications */
  hasNotifications?: boolean;
  /** Callback when notification bell is pressed */
  onNotificationPress?: () => void;
  /** Test ID for testing */
  testID?: string;
}

/**
 * DailyHubHeader - Top section of Home Hub
 *
 * Shows:
 * - Time-based greeting
 * - User name
 * - Season badge with progress
 * - Notification button
 */
export function DailyHubHeader({
  displayName = 'Atleta',
  seasonNumber = 1,
  weekNumber = 1,
  seasonName = 'FOUNDATION',
  hasNotifications = false,
  onNotificationPress,
  testID,
}: DailyHubHeaderProps) {
  // Calculate time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12
    ? 'Buenos días'
    : hour < 18
      ? 'Buenas tardes'
      : 'Buenas noches';

  return (
    <View style={styles.container} testID={testID}>
      {/* Top row: Greeting + Notifications */}
      <View style={styles.topRow}>
        <View style={styles.greetingSection}>
          <Hexagon size={20} color={colors.ngx} fill={colors.ngx} fillOpacity={0.2} />
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
        </View>

        <Pressable
          style={styles.notificationButton}
          onPress={onNotificationPress}
        >
          <Bell size={20} color={colors.chrome} />
          {hasNotifications && <View style={styles.notificationBadge} />}
        </Pressable>
      </View>

      {/* Season Badge */}
      <View style={styles.seasonBadge}>
        <View style={styles.seasonDot} />
        <Text style={styles.seasonText}>
          SEASON {seasonNumber} • SEMANA {weekNumber}/12 • {seasonName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  greeting: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  userName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  notificationButton: {
    width: touchTarget.min,
    height: touchTarget.min,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: touchTarget.min / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.void,
  },
  seasonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(109, 0, 255, 0.1)',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.2)',
  },
  seasonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.ngx,
  },
  seasonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.ngx,
    letterSpacing: 1.5,
  },
});

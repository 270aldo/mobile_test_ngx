import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

type ProgressView = 'season' | 'week' | 'metrics' | 'photos';

interface ViewSelectorProps {
  /** Currently active view */
  activeView: ProgressView;
  /** Callback when view changes */
  onViewChange: (view: ProgressView) => void;
  /** Test ID for testing */
  testID?: string;
}

const VIEWS: { key: ProgressView; label: string }[] = [
  { key: 'season', label: 'SEASON' },
  { key: 'week', label: 'SEMANA' },
  { key: 'metrics', label: 'MÉTRICAS' },
  { key: 'photos', label: '📸' },
];

/**
 * ViewSelector - Horizontal tabs for Progress screen views
 *
 * Allows user to switch between:
 * - SEASON: Progress toward season goal
 * - SEMANA: Weekly adherence and streak
 * - MÉTRICAS: Charts and trends
 * - 📸: Progress photos timeline
 */
export function ViewSelector({
  activeView,
  onViewChange,
  testID,
}: ViewSelectorProps) {
  return (
    <View style={styles.container} testID={testID}>
      {VIEWS.map((view) => {
        const isActive = activeView === view.key;
        return (
          <Pressable
            key={view.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onViewChange(view.key)}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {view.label}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

export type { ProgressView };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
  },
  tabText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: colors.ngx,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.ngx,
  },
});

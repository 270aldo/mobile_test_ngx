import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Crown,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  CreditCard,
  Calendar,
  Zap,
  Edit3,
} from 'lucide-react-native';
import { GlassCard, StatusPill, ScreenBackground } from '@/components/ui';
import { useAuthStore, useUser } from '@/stores/auth';
import { useProfile, useSubscription } from '@/stores/profile';
import { useBadges } from '@/stores/progress';
import { useWeekWorkouts } from '@/stores/season';
import { colors, spacing, typography, layout, borderRadius, touchTarget } from '@/constants/theme';

const menuItems = [
  { id: 'settings', icon: Settings, label: 'Configuración', sublabel: 'Preferencias de app' },
  { id: 'notifications', icon: Bell, label: 'Notificaciones', sublabel: 'Gestionar alertas' },
  { id: 'billing', icon: CreditCard, label: 'Facturación', sublabel: 'Plan y pagos' },
  { id: 'privacy', icon: Shield, label: 'Privacidad', sublabel: 'Seguridad de datos' },
  { id: 'help', icon: HelpCircle, label: 'Ayuda', sublabel: 'Soporte y FAQ' },
];

export default function ProfileScreen() {
  const user = useUser();
  const profile = useProfile();
  const subscription = useSubscription();
  const badges = useBadges();
  const weekWorkouts = useWeekWorkouts();
  const signOut = useAuthStore((s) => s.signOut);

  // User info with fallbacks
  const userName = profile?.full_name || user?.user_metadata?.full_name || 'NGX Athlete';
  const userEmail = profile?.email || user?.email || 'athlete@ngx.com';
  const userInitial = userName.charAt(0).toUpperCase();

  // Subscription info
  const planName = subscription?.plan?.replace('_', ' ').toUpperCase() || 'GENESIS';
  const planPrice = subscription?.price_monthly ? `$${subscription.price_monthly}` : '$199';
  const isActive = subscription?.status === 'active';
  const renewalDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'N/A';
  const memberSince = subscription?.current_period_start
    ? new Date(subscription.current_period_start).toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })
    : 'Dic 2024';

  // Stats
  const totalWorkouts = weekWorkouts?.filter(w => w.status === 'completed').length ?? 0;
  const prCount = badges?.filter(b => b.badge_type === 'pr').length ?? 0;

  const handleSignOut = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <Pressable style={styles.settingsButton}>
            <Settings size={20} color={colors.text} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <GlassCard variant="elevated" style={styles.profileCard}>
            <View style={styles.profileContent}>
              <View style={styles.avatarSection}>
                <View style={styles.avatarLarge}>
                  <Text style={styles.avatarText}>{userInitial}</Text>
                </View>
                <Pressable style={styles.editAvatar}>
                  <Edit3 size={12} color={colors.text} />
                </Pressable>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userName}</Text>
                <Text style={styles.profileEmail}>{userEmail}</Text>

                <View style={styles.proBadge}>
                  <Crown size={12} color={colors.ngx} />
                  <Text style={styles.proBadgeText}>GENESIS PRO</Text>
                </View>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.profileStats}>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatValue}>{totalWorkouts}</Text>
                <Text style={styles.profileStatLabel}>Workouts</Text>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStat}>
                <Text style={styles.profileStatValue}>{profile?.training_days_per_week ?? 4}</Text>
                <Text style={styles.profileStatLabel}>días/sem</Text>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStat}>
                <Text style={styles.profileStatValue}>{prCount}</Text>
                <Text style={styles.profileStatLabel}>PRs</Text>
              </View>
            </View>
          </GlassCard>

          {/* Subscription Card */}
          <GlassCard style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <View style={styles.subscriptionInfo}>
                <View style={styles.planBadge}>
                  <Zap size={14} color={colors.ngx} />
                  <Text style={styles.planName}>{planName}</Text>
                </View>
                <Text style={styles.planPrice}>{planPrice}/mes</Text>
              </View>
              <StatusPill>{isActive ? 'Activo' : 'Inactivo'}</StatusPill>
            </View>

            <View style={styles.subscriptionMeta}>
              <View style={styles.metaRow}>
                <Calendar size={14} color={colors.textMuted} />
                <Text style={styles.metaText}>Próxima renovación: {renewalDate}</Text>
              </View>
              <View style={styles.metaRow}>
                <Crown size={14} color={colors.textMuted} />
                <Text style={styles.metaText}>Miembro desde {memberSince}</Text>
              </View>
            </View>

            <Pressable style={styles.managePlan}>
              <Text style={styles.managePlanText}>Gestionar suscripción</Text>
              <ChevronRight size={16} color={colors.ngx} />
            </Pressable>
          </GlassCard>

          {/* Menu */}
          <Text style={styles.sectionTitle}>Cuenta</Text>
          <GlassCard style={styles.menuCard} padding="none">
            {menuItems.map((item, index) => (
              <View key={item.id}>
                <Pressable style={styles.menuItem}>
                  <View style={styles.menuIcon}>
                    <item.icon size={18} color={colors.ngx} />
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <Text style={styles.menuSublabel}>{item.sublabel}</Text>
                  </View>
                  <ChevronRight size={18} color={colors.textMuted} />
                </Pressable>
                {index < menuItems.length - 1 && (
                  <View style={styles.menuDivider} />
                )}
              </View>
            ))}
          </GlassCard>

          {/* Sign Out */}
          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={18} color={colors.error} />
            <Text style={styles.signOutText}>Cerrar Sesión</Text>
          </Pressable>

          {/* Version */}
          <View style={styles.versionSection}>
            <Text style={styles.versionText}>NGX GENESIS HYBRID v1.0.0</Text>
            <Text style={styles.versionBuild}>Build 2025.01.24</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.contentPadding,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  settingsButton: {
    width: touchTarget.min,
    height: touchTarget.min,
    borderRadius: touchTarget.min / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.contentPadding,
    paddingBottom: layout.contentPaddingBottom,
    gap: spacing.lg,
  },

  // Profile Card
  profileCard: {},
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  avatarSection: {
    position: 'relative',
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.ngx,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(109, 0, 255, 0.4)',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.void,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  profileEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(109, 0, 255, 0.12)',
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  proBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.ngx,
    letterSpacing: 1.5,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  profileStatLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  profileStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },

  // Subscription
  subscriptionCard: {
    borderColor: 'rgba(109, 0, 255, 0.25)',
    borderWidth: 1,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  subscriptionInfo: {},
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  planName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  planPrice: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  subscriptionMeta: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  managePlan: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  managePlanText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.ngx,
  },

  // Menu
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: -spacing.sm,
  },
  menuCard: {},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(109, 0, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  menuSublabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginHorizontal: spacing.md,
  },

  // Sign Out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(255, 71, 87, 0.08)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.2)',
  },
  signOutText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.error,
  },

  // Version
  versionSection: {
    alignItems: 'center',
    gap: 2,
  },
  versionText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  versionBuild: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    opacity: 0.6,
  },
});

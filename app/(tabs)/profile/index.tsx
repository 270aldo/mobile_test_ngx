import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Hexagon,
  User,
  Crown,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  CreditCard,
  Calendar,
} from 'lucide-react-native';
import { GlassCard, Button, Label, StatusPill } from '@/components/ui';
import { useAuthStore, useUser } from '@/stores/auth';
import { colors, spacing, typography, gradients, layout, borderRadius } from '@/constants/theme';

const menuItems = [
  {
    id: 'settings',
    icon: Settings,
    label: 'Configuración',
    sublabel: 'Preferencias de la app',
  },
  {
    id: 'notifications',
    icon: Bell,
    label: 'Notificaciones',
    sublabel: 'Gestionar alertas',
  },
  {
    id: 'billing',
    icon: CreditCard,
    label: 'Suscripción',
    sublabel: 'Plan y facturación',
  },
  {
    id: 'privacy',
    icon: Shield,
    label: 'Privacidad',
    sublabel: 'Seguridad de datos',
  },
  {
    id: 'help',
    icon: HelpCircle,
    label: 'Ayuda',
    sublabel: 'Soporte y FAQ',
  },
];

/**
 * ProfileScreen - DATA VAULT
 *
 * Basado en: mobile_genesis_hybrid_v2_flow.html
 * Perfil de usuario con suscripción y configuración
 */
export default function ProfileScreen() {
  const user = useUser();
  const signOut = useAuthStore((s) => s.signOut);

  const userName = user?.user_metadata?.full_name || 'NGX Athlete';
  const userEmail = user?.email || 'athlete@ngx.com';

  const handleSignOut = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: signOut,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={gradients.background}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Hexagon size={16} color={colors.ngx} />
              <Text style={styles.headerLogo}>NGX.GENESIS</Text>
            </View>
            <Pressable style={styles.settingsButton}>
              <Settings size={18} color={colors.chrome} />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.titleSection}>
            <Label>Data Vault</Label>
            <Text style={styles.title}>TU PERFIL</Text>
          </View>

          {/* User Card */}
          <GlassCard style={styles.userCard}>
            <View style={styles.userRow}>
              <View style={styles.avatarLarge}>
                <User size={32} color={colors.text} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userName}</Text>
                <Label color="chrome">{userEmail}</Label>
                <View style={styles.memberBadge}>
                  <Crown size={12} color={colors.ngx} />
                  <Text style={styles.memberText}>GENESIS Pro</Text>
                </View>
              </View>
            </View>
          </GlassCard>

          {/* Subscription Card */}
          <GlassCard style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <View>
                <Label>Tu Suscripción</Label>
                <Text style={styles.subscriptionPlan}>NGX GENESIS Pro</Text>
              </View>
              <StatusPill>Activo</StatusPill>
            </View>

            <View style={styles.subscriptionDetails}>
              <View style={styles.subscriptionStat}>
                <Calendar size={14} color={colors.chromeDark} />
                <Label color="chrome">Próxima renovación: 15 Feb 2025</Label>
              </View>
              <View style={styles.subscriptionStat}>
                <CreditCard size={14} color={colors.chromeDark} />
                <Label color="chrome">$199/mes</Label>
              </View>
            </View>

            <View style={styles.subscriptionActions}>
              <Button variant="chip" onPress={() => {}} style={styles.subscriptionChip}>
                Cambiar plan
              </Button>
              <Button variant="chip" onPress={() => {}} style={styles.subscriptionChip}>
                Ver facturación
              </Button>
            </View>
          </GlassCard>

          {/* Stats Summary */}
          <View style={styles.statsRow}>
            <GlassCard style={styles.miniStatCard}>
              <Text style={styles.miniStatValue}>42</Text>
              <Label color="chrome">Workouts</Label>
            </GlassCard>
            <GlassCard style={styles.miniStatCard}>
              <Text style={styles.miniStatValue}>14</Text>
              <Label color="chrome">Semanas</Label>
            </GlassCard>
            <GlassCard style={styles.miniStatCard}>
              <Text style={styles.miniStatValue}>3</Text>
              <Label color="chrome">PRs</Label>
            </GlassCard>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <Label>Cuenta</Label>
            {menuItems.map((item) => (
              <Pressable key={item.id}>
                <GlassCard style={styles.menuItem}>
                  <View style={styles.menuRow}>
                    <View style={styles.menuIconContainer}>
                      <item.icon size={18} color={colors.ngx} />
                    </View>
                    <View style={styles.menuContent}>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      <Label color="chrome">{item.sublabel}</Label>
                    </View>
                    <ChevronRight size={18} color={colors.chromeDark} />
                  </View>
                </GlassCard>
              </Pressable>
            ))}
          </View>

          {/* Sign Out */}
          <Button
            variant="secondary"
            onPress={handleSignOut}
            fullWidth
            style={styles.signOutButton}
            testID="sign-out-button"
          >
            <View style={styles.signOutContent}>
              <LogOut size={18} color={colors.error} />
              <Text style={styles.signOutText}>Cerrar Sesión</Text>
            </View>
          </Button>

          {/* App Version */}
          <View style={styles.versionSection}>
            <Label color="chrome">NGX GENESIS HYBRID v1.0.0</Label>
            <Label color="chrome">Build 2025.01.23</Label>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: layout.headerHeight,
    justifyContent: 'flex-end',
    paddingHorizontal: layout.contentPadding,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogo: {
    fontSize: typography.fontSize.label,
    fontWeight: typography.fontWeight.bold,
    color: colors.ngx,
    letterSpacing: typography.letterSpacing.wider,
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.contentPadding,
    paddingBottom: layout.contentPaddingBottom,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  userCard: {
    marginBottom: spacing.lg,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.ngx,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 2,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  memberText: {
    fontSize: typography.fontSize.label,
    color: colors.ngx,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
  },
  subscriptionCard: {
    marginBottom: spacing.lg,
    borderColor: 'rgba(109, 0, 255, 0.3)',
    borderWidth: 1,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subscriptionPlan: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: 4,
  },
  subscriptionDetails: {
    gap: 8,
    marginBottom: 16,
  },
  subscriptionStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subscriptionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  subscriptionChip: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.xl,
  },
  miniStatCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  miniStatValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 4,
  },
  menuSection: {
    marginBottom: spacing.xl,
  },
  menuItem: {
    marginTop: spacing.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
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
    marginBottom: 2,
  },
  signOutButton: {
    marginBottom: spacing.lg,
    borderColor: colors.error,
  },
  signOutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signOutText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.error,
  },
  versionSection: {
    alignItems: 'center',
    gap: 4,
  },
});

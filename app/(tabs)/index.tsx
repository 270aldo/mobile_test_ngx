import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Hexagon,
  Bell,
  Play,
  Calendar,
  Flame,
  Moon,
  Droplet,
  Footprints,
  ChevronRight,
  Sparkles,
  MessageCircle,
} from 'lucide-react-native';
import {
  GlassCard,
  Button,
  Label,
  StatusPill,
  PulseDot,
  ProgressRing,
  StatCard,
} from '@/components/ui';
import { useUser } from '@/stores/auth';
import { colors, spacing, typography, layout, touchTarget } from '@/constants/theme';

export default function HomeScreen() {
  const user = useUser();
  const router = useRouter();

  // Calculate time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  // Mock data - will come from stores
  const weekProgress = 43; // 3/7 days = 43%
  const completedDays = 3;
  const totalDays = 7;

  return (
    <View style={styles.container}>
      {/* Premium gradient background */}
      <LinearGradient
        colors={['#0A0A0F', '#0D0B14', '#050505']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle radial glow */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={['rgba(109, 0, 255, 0.08)', 'transparent']}
          style={styles.glow}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Hexagon size={20} color={colors.ngx} fill={colors.ngx} fillOpacity={0.2} />
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.userName}>{user?.email?.split('@')[0] || 'Atleta'}</Text>
            </View>
          </View>
          <Pressable style={styles.notificationButton}>
            <Bell size={20} color={colors.chrome} />
            <View style={styles.notificationBadge} />
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Season Badge */}
          <View style={styles.seasonBadge}>
            <View style={styles.seasonDot} />
            <Text style={styles.seasonText}>SEASON 2 • WEEK 3 • FOUNDATION</Text>
          </View>

          {/* Hero Mission Card */}
          <GlassCard variant="hero" style={styles.heroCard}>
            <View style={styles.heroContent}>
              {/* Left: Info */}
              <View style={styles.heroInfo}>
                <Label color="ngx">Misión del día</Label>
                <Text style={styles.heroTitle}>Upper Body</Text>
                <Text style={styles.heroSubtitle}>Push // Fuerza</Text>

                <View style={styles.heroMeta}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaValue}>45</Text>
                    <Text style={styles.metaLabel}>min</Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaItem}>
                    <Text style={styles.metaValue}>5</Text>
                    <Text style={styles.metaLabel}>ejercicios</Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaItem}>
                    <Text style={styles.metaValue}>RPE</Text>
                    <Text style={styles.metaLabel}>7-8</Text>
                  </View>
                </View>
              </View>

              {/* Right: Progress Ring */}
              <View style={styles.heroProgress}>
                <ProgressRing
                  progress={weekProgress}
                  size={90}
                  strokeWidth={6}
                  value={`${completedDays}/${totalDays}`}
                  sublabel="semana"
                />
              </View>
            </View>

            {/* CTA Button */}
            <Button
              variant="primary"
              onPress={() => router.push('/(tabs)/train')}
              fullWidth
              testID="start-workout-button"
              style={styles.heroCta}
            >
              <Play size={18} color={colors.text} style={{ marginRight: 8 }} />
              Iniciar sesión
            </Button>

            {/* Secondary actions */}
            <View style={styles.heroActions}>
              <Pressable style={styles.heroAction}>
                <Calendar size={14} color={colors.textMuted} />
                <Text style={styles.heroActionText}>Reprogramar</Text>
              </Pressable>
              <View style={styles.heroActionDivider} />
              <Pressable style={styles.heroAction}>
                <Text style={styles.heroActionText}>Ver detalles</Text>
                <ChevronRight size={14} color={colors.textMuted} />
              </Pressable>
            </View>
          </GlassCard>

          {/* Stats Grid */}
          <Text style={styles.sectionTitle}>Métricas del día</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon={Flame}
              label="Calorías"
              value="1,680"
              sublabel="/ 2,300"
              progress={73}
              color="warning"
              style={styles.statCard}
            />
            <StatCard
              icon={Moon}
              label="Sueño"
              value="7.1h"
              sublabel="Anoche"
              progress={89}
              color="primary"
              style={styles.statCard}
            />
            <StatCard
              icon={Droplet}
              label="Agua"
              value="2.3L"
              sublabel="/ 3.0L"
              progress={77}
              color="mint"
              style={styles.statCard}
            />
            <StatCard
              icon={Footprints}
              label="Pasos"
              value="7,820"
              sublabel="Hoy"
              progress={78}
              color="chrome"
              style={styles.statCard}
            />
          </View>

          {/* Coach Card */}
          <GlassCard variant="mint" style={styles.coachCard}>
            <View style={styles.coachHeader}>
              <View style={styles.coachBadge}>
                <Text style={styles.coachBadgeText}>COACH</Text>
              </View>
              <PulseDot color="mint" size={8} />
            </View>

            <Text style={styles.coachTitle}>Gran progreso esta semana</Text>
            <Text style={styles.coachMessage}>
              Tu consistencia está pagando dividendos. El incremento en press de banca confirma que la fase foundation funciona.
            </Text>

            <Pressable style={styles.coachCta}>
              <MessageCircle size={14} color={colors.mint} />
              <Text style={styles.coachCtaText}>Responder al coach</Text>
              <ChevronRight size={14} color={colors.mint} />
            </Pressable>
          </GlassCard>

          {/* GENESIS Card */}
          <Pressable onPress={() => router.push('/(tabs)/chat')}>
            <GlassCard style={styles.genesisCard}>
              <View style={styles.genesisContent}>
                <View style={styles.genesisIcon}>
                  <Sparkles size={24} color={colors.ngx} />
                </View>
                <View style={styles.genesisText}>
                  <Text style={styles.genesisTitle}>GENESIS</Text>
                  <Text style={styles.genesisSubtitle}>
                    Pregunta lo que quieras sobre tu programa
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </View>
            </GlassCard>
          </Pressable>
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
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
  },
  glow: {
    flex: 1,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
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
  headerLeft: {
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

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.contentPadding,
    paddingBottom: layout.contentPaddingBottom,
    gap: spacing.lg,
  },

  // Season Badge
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

  // Hero Card
  heroCard: {
    marginTop: spacing.xs,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  heroInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  heroTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.xs,
  },
  heroSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: 2,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  metaLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroProgress: {
    alignItems: 'center',
  },
  heroCta: {
    marginBottom: spacing.md,
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  heroActionText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  heroActionDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: spacing.xs,
  },

  // Section
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: -spacing.sm,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
  },

  // Coach Card
  coachCard: {
    borderColor: 'rgba(0, 245, 170, 0.25)',
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  coachBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
    borderRadius: 100,
  },
  coachBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.mint,
    letterSpacing: 1.5,
  },
  coachTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  coachMessage: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  coachCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
  },
  coachCtaText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.mint,
  },

  // GENESIS Card
  genesisCard: {
    paddingVertical: spacing.md,
  },
  genesisContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  genesisIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genesisText: {
    flex: 1,
  },
  genesisTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.ngx,
    letterSpacing: 2,
  },
  genesisSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
});

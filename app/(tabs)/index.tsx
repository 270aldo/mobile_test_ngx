import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Hexagon,
  User,
  Flame,
  Moon,
  Droplet,
  Footprints,
  Sparkles,
  UserCircle,
} from 'lucide-react-native';
import { GlassCard, Button, Label, StatusPill, PulseDot } from '@/components/ui';
import { useUser } from '@/stores/auth';
import { colors, spacing, typography, gradients, layout } from '@/constants/theme';

export default function HomeScreen() {
  const user = useUser();

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
            <View style={styles.headerRight}>
              <View style={styles.avatarContainer}>
                <User size={16} color={colors.chrome} />
              </View>
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Season/Week Label */}
          <View style={styles.seasonLabel}>
            <Label>Season 2 // Week 3</Label>
          </View>

          {/* Title */}
          <Text style={styles.title}>Command Center</Text>
          <Text style={styles.subtitle}>Performance & Longevity. Sin plantillas.</Text>
          <Text style={styles.todayLabel}>Hoy: Upper Body // Push</Text>

          {/* Mission Card */}
          <GlassCard style={styles.missionCard}>
            <View style={styles.missionHeader}>
              <View>
                <Label>Mision del dia</Label>
                <Text style={styles.missionTitle}>Upper Body // Push</Text>
                <Label color="chrome">45 min // 5 ejercicios // Fuerza</Label>
              </View>
              <View style={styles.missionStatus}>
                <StatusPill>Pendiente</StatusPill>
                <Button variant="chip" onPress={() => {}}>
                  Calendario
                </Button>
              </View>
            </View>

            <View style={styles.chipRow}>
              <Button variant="chip" onPress={() => {}}>
                Equipo: Gym
              </Button>
              <Button variant="chip" onPress={() => {}}>
                Intensidad: Media
              </Button>
            </View>

            <Button
              variant="primary"
              onPress={() => {}}
              fullWidth
              testID="start-workout-button"
            >
              Iniciar sesion
            </Button>

            {/* Progress dots */}
            <View style={styles.progressRow}>
              <View style={styles.progressDots}>
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.progressDot,
                      i <= 2 && styles.progressDotActive,
                      i === 3 && styles.progressDotCurrent,
                    ]}
                  />
                ))}
              </View>
              <Label color="chrome">3/7 completados</Label>
            </View>

            <Button
              variant="secondary"
              onPress={() => {}}
              fullWidth
              style={styles.rescheduleButton}
            >
              Reprogramar sesion
            </Button>
          </GlassCard>

          {/* Coach Card */}
          <GlassCard style={styles.coachCard}>
            <View style={styles.coachRow}>
              <View style={styles.coachAvatar}>
                <UserCircle size={20} color={colors.mint} />
              </View>
              <View style={styles.coachContent}>
                <Label>Coach Hybrid</Label>
                <Text style={styles.coachMessage}>
                  "Gran progreso esta semana. Recuerda..."
                </Text>
                <Label color="chrome">Tap para abrir</Label>
              </View>
            </View>
            <View style={styles.unreadRow}>
              <PulseDot color="mint" />
              <Label color="chrome">1 mensaje sin leer</Label>
            </View>
          </GlassCard>

          {/* Metrics Grid */}
          <View style={styles.metricsGrid}>
            <GlassCard style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Flame size={14} color={colors.ngx} />
              </View>
              <Label>kcal hoy</Label>
              <Text style={styles.metricValue}>1680 / 2300</Text>
              <Label color="chrome">Objetivo diario</Label>
            </GlassCard>

            <GlassCard style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Moon size={14} color={colors.ngx} />
              </View>
              <Label>Sueno</Label>
              <Text style={styles.metricValue}>7.1h</Text>
              <Label color="chrome">Anoche</Label>
            </GlassCard>

            <GlassCard style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Droplet size={14} color={colors.ngx} />
              </View>
              <Label>Agua</Label>
              <Text style={styles.metricValue}>2.3L</Text>
              <Label color="chrome">Meta 3.0L</Label>
            </GlassCard>

            <GlassCard style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Footprints size={14} color={colors.ngx} />
              </View>
              <Label>Pasos</Label>
              <Text style={styles.metricValue}>7,820</Text>
              <Label color="chrome">Hoy</Label>
            </GlassCard>
          </View>

          {/* GENESIS Card */}
          <GlassCard style={styles.genesisCard}>
            <View style={styles.genesisRow}>
              <View>
                <Label>GENESIS Interface</Label>
                <Text style={styles.genesisTitle}>Pregunta cualquier cosa</Text>
                <Label color="chrome">Tu programa, nutricion, recovery</Label>
              </View>
              <Sparkles size={20} color={colors.ngx} />
            </View>
          </GlassCard>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
  seasonLabel: {
    marginBottom: 4,
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: typography.fontSize.label,
    color: colors.chromeDark,
    marginTop: 8,
  },
  todayLabel: {
    fontSize: typography.fontSize.label,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.xl,
  },
  missionCard: {
    marginBottom: spacing.lg,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  missionTitle: {
    fontSize: typography.fontSize.xl,
    color: colors.text,
    marginVertical: 4,
  },
  missionStatus: {
    alignItems: 'flex-end',
    gap: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 4,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressDotActive: {
    backgroundColor: colors.ngx,
  },
  progressDotCurrent: {
    backgroundColor: 'rgba(109, 0, 255, 0.4)',
  },
  rescheduleButton: {
    marginTop: 12,
  },
  coachCard: {
    marginBottom: spacing.lg,
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  coachAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 170, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachContent: {
    flex: 1,
  },
  coachMessage: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    marginVertical: 4,
  },
  unreadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: spacing.lg,
  },
  metricCard: {
    width: '48%',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  metricIcon: {
    marginBottom: 4,
  },
  metricValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginVertical: 4,
  },
  genesisCard: {
    marginBottom: spacing.lg,
  },
  genesisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genesisTitle: {
    fontSize: typography.fontSize.xl,
    color: colors.text,
    marginVertical: 4,
  },
});

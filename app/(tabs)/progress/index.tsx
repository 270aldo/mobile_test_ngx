import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Hexagon,
  User,
  TrendingUp,
  TrendingDown,
  Scale,
  Activity,
  Dumbbell,
  Calendar,
  ChevronRight,
} from 'lucide-react-native';
import { GlassCard, Button, Label, StatusPill } from '@/components/ui';
import { colors, spacing, typography, gradients, layout, borderRadius } from '@/constants/theme';

// Placeholder stats
const stats = {
  currentWeight: 82.5,
  weightChange: -1.2,
  bodyFat: 18.5,
  bodyFatChange: -0.8,
  totalVolume: 24680,
  volumeChange: 12,
  streak: 14,
};

// Weekly progress data
const weeklyProgress = [
  { day: 'L', completed: true, volume: 4200 },
  { day: 'M', completed: true, volume: 3800 },
  { day: 'X', completed: true, volume: 4500 },
  { day: 'J', completed: false, volume: 0 },
  { day: 'V', completed: false, volume: 0 },
  { day: 'S', completed: false, volume: 0 },
  { day: 'D', completed: false, volume: 0 },
];

/**
 * ProgressScreen - TACTICAL MAP
 *
 * Basado en: mobile_genesis_hybrid_v2_flow.html
 * Dashboard de progreso con métricas y visualizaciones
 */
export default function ProgressScreen() {
  const maxVolume = Math.max(...weeklyProgress.map(d => d.volume), 1);

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
          {/* Title */}
          <View style={styles.titleSection}>
            <Label>Tactical Map</Label>
            <Text style={styles.title}>TU PROGRESO</Text>
            <Text style={styles.subtitle}>Season 2 // Semana 3</Text>
          </View>

          {/* Streak Card */}
          <GlassCard style={styles.streakCard}>
            <View style={styles.streakRow}>
              <View style={styles.streakInfo}>
                <View style={styles.streakIcon}>
                  <Activity size={20} color={colors.mint} />
                </View>
                <View>
                  <Label color="mint">Racha Actual</Label>
                  <Text style={styles.streakValue}>{stats.streak} días</Text>
                </View>
              </View>
              <StatusPill>En fuego</StatusPill>
            </View>
          </GlassCard>

          {/* Main Stats Grid */}
          <View style={styles.statsGrid}>
            <GlassCard style={styles.statCard}>
              <View style={styles.statIcon}>
                <Scale size={14} color={colors.ngx} />
              </View>
              <Label>Peso</Label>
              <Text style={styles.statValue}>{stats.currentWeight}</Text>
              <Label color="chrome">kg</Label>
              <View style={styles.statTrend}>
                <TrendingDown size={12} color={colors.mint} />
                <Text style={styles.statTrendText}>{Math.abs(stats.weightChange)} kg</Text>
              </View>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <View style={styles.statIcon}>
                <Activity size={14} color={colors.ngx} />
              </View>
              <Label>Body Fat</Label>
              <Text style={styles.statValue}>{stats.bodyFat}</Text>
              <Label color="chrome">%</Label>
              <View style={styles.statTrend}>
                <TrendingDown size={12} color={colors.mint} />
                <Text style={styles.statTrendText}>{Math.abs(stats.bodyFatChange)}%</Text>
              </View>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <View style={styles.statIcon}>
                <Dumbbell size={14} color={colors.ngx} />
              </View>
              <Label>Volumen</Label>
              <Text style={styles.statValue}>{(stats.totalVolume / 1000).toFixed(1)}k</Text>
              <Label color="chrome">kg total</Label>
              <View style={styles.statTrend}>
                <TrendingUp size={12} color={colors.mint} />
                <Text style={styles.statTrendText}>+{stats.volumeChange}%</Text>
              </View>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <View style={styles.statIcon}>
                <Calendar size={14} color={colors.ngx} />
              </View>
              <Label>Sesiones</Label>
              <Text style={styles.statValue}>3/5</Text>
              <Label color="chrome">esta semana</Label>
              <View style={styles.statTrend}>
                <Text style={styles.statTrendNeutral}>En curso</Text>
              </View>
            </GlassCard>
          </View>

          {/* Weekly Chart */}
          <GlassCard style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Label>Volumen Semanal</Label>
              <Pressable style={styles.chartAction}>
                <Label color="chrome">Ver más</Label>
                <ChevronRight size={14} color={colors.chromeDark} />
              </Pressable>
            </View>

            <View style={styles.chartContainer}>
              {weeklyProgress.map((day, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <LinearGradient
                      colors={day.completed ? gradients.progress : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']}
                      style={[
                        styles.barFill,
                        { height: `${(day.volume / maxVolume) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={[
                    styles.barLabel,
                    day.completed && styles.barLabelActive,
                  ]}>
                    {day.day}
                  </Text>
                </View>
              ))}
            </View>
          </GlassCard>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <Label>Registrar</Label>
            <View style={styles.actionsRow}>
              <Button variant="chip" onPress={() => {}} style={styles.actionChip}>
                + Peso
              </Button>
              <Button variant="chip" onPress={() => {}} style={styles.actionChip}>
                + Medidas
              </Button>
              <Button variant="chip" onPress={() => {}} style={styles.actionChip}>
                + Foto
              </Button>
            </View>
          </View>

          {/* Progress History */}
          <GlassCard style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Label>Historial Reciente</Label>
              <ChevronRight size={16} color={colors.chromeDark} />
            </View>
            <View style={styles.historyItem}>
              <View style={styles.historyDot} />
              <View style={styles.historyContent}>
                <Text style={styles.historyTitle}>Peso registrado: 82.5 kg</Text>
                <Label color="chrome">Hoy, 8:30 AM</Label>
              </View>
            </View>
            <View style={styles.historyItem}>
              <View style={styles.historyDot} />
              <View style={styles.historyContent}>
                <Text style={styles.historyTitle}>Sesión completada: Upper Body</Text>
                <Label color="chrome">Ayer, 7:15 PM</Label>
              </View>
            </View>
            <View style={styles.historyItem}>
              <View style={styles.historyDot} />
              <View style={styles.historyContent}>
                <Text style={styles.historyTitle}>PR en Bench Press: 85 kg</Text>
                <Label color="chrome">Hace 2 días</Label>
              </View>
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
  subtitle: {
    fontSize: typography.fontSize.label,
    color: colors.chromeDark,
    marginTop: 4,
  },
  streakCard: {
    marginBottom: spacing.lg,
    borderColor: 'rgba(0, 245, 170, 0.3)',
    borderWidth: 1,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '48%',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statIcon: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginVertical: 4,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  statTrendText: {
    fontSize: typography.fontSize.label,
    color: colors.mint,
    fontWeight: typography.fontWeight.medium,
  },
  statTrendNeutral: {
    fontSize: typography.fontSize.label,
    color: colors.chromeDark,
  },
  chartCard: {
    marginBottom: spacing.lg,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  barContainer: {
    width: 24,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: typography.fontSize.label,
    color: colors.chromeDark,
    textTransform: 'uppercase',
  },
  barLabelActive: {
    color: colors.ngx,
  },
  actionsSection: {
    marginBottom: spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionChip: {
    flex: 1,
  },
  historyCard: {
    marginBottom: spacing.lg,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ngx,
    marginTop: 4,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    marginBottom: 2,
  },
});

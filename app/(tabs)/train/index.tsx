import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Hexagon,
  User,
  ChevronLeft,
  Timer,
  Flame,
  Play,
  CheckCircle2,
  Circle,
} from 'lucide-react-native';
import { GlassCard, Button, Label, StatusPill } from '@/components/ui';
import { colors, spacing, typography, gradients, layout, borderRadius } from '@/constants/theme';

// Placeholder exercise data
const exercises = [
  {
    id: '1',
    name: 'Bench Press',
    sets: '4 x 8-10',
    weight: '80kg',
    completed: true,
  },
  {
    id: '2',
    name: 'Overhead Press',
    sets: '3 x 10-12',
    weight: '45kg',
    completed: true,
  },
  {
    id: '3',
    name: 'Incline DB Press',
    sets: '3 x 12',
    weight: '30kg',
    completed: false,
    current: true,
  },
  {
    id: '4',
    name: 'Cable Flyes',
    sets: '3 x 15',
    weight: '15kg',
    completed: false,
  },
  {
    id: '5',
    name: 'Tricep Pushdowns',
    sets: '3 x 12-15',
    weight: '25kg',
    completed: false,
  },
];

/**
 * TrainScreen - ACTIVE OPS (Workout Session)
 *
 * Basado en: mobile_genesis_hybrid_v2_flow.html
 * Pantalla de sesión de entrenamiento activa con lista de ejercicios
 */
export default function TrainScreen() {
  const completedCount = exercises.filter((e) => e.completed).length;

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
          {/* Back button + Title */}
          <View style={styles.titleRow}>
            <Pressable style={styles.backButton}>
              <ChevronLeft size={20} color={colors.chrome} />
            </Pressable>
            <View>
              <Label>Active Ops</Label>
              <Text style={styles.title}>UPPER BODY // PUSH</Text>
            </View>
          </View>

          {/* Session Info Card */}
          <GlassCard style={styles.sessionCard}>
            <View style={styles.sessionRow}>
              <View style={styles.sessionStat}>
                <Timer size={14} color={colors.ngx} />
                <Text style={styles.sessionValue}>24:35</Text>
                <Label color="chrome">Tiempo</Label>
              </View>
              <View style={styles.sessionDivider} />
              <View style={styles.sessionStat}>
                <Flame size={14} color={colors.ngx} />
                <Text style={styles.sessionValue}>186</Text>
                <Label color="chrome">kcal</Label>
              </View>
              <View style={styles.sessionDivider} />
              <View style={styles.sessionStat}>
                <CheckCircle2 size={14} color={colors.mint} />
                <Text style={styles.sessionValue}>{completedCount}/{exercises.length}</Text>
                <Label color="chrome">Sets</Label>
              </View>
            </View>
          </GlassCard>

          {/* Exercises List */}
          <View style={styles.exercisesSection}>
            <Label>Ejercicios</Label>

            {exercises.map((exercise, index) => (
              <GlassCard
                key={exercise.id}
                style={[
                  styles.exerciseCard,
                  exercise.current && styles.exerciseCardCurrent,
                ]}
              >
                <View style={styles.exerciseRow}>
                  {/* Status indicator */}
                  <View style={styles.exerciseStatus}>
                    {exercise.completed ? (
                      <CheckCircle2 size={20} color={colors.mint} />
                    ) : exercise.current ? (
                      <Play size={20} color={colors.ngx} />
                    ) : (
                      <Circle size={20} color={colors.chromeDark} />
                    )}
                  </View>

                  {/* Exercise info */}
                  <View style={styles.exerciseInfo}>
                    <Text style={[
                      styles.exerciseName,
                      exercise.completed && styles.exerciseNameCompleted,
                    ]}>
                      {exercise.name}
                    </Text>
                    <View style={styles.exerciseMeta}>
                      <Label color="chrome">{exercise.sets}</Label>
                      <Text style={styles.exerciseWeight}>{exercise.weight}</Text>
                    </View>
                  </View>

                  {/* Current badge */}
                  {exercise.current && (
                    <StatusPill>En curso</StatusPill>
                  )}
                </View>
              </GlassCard>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <Button
              variant="secondary"
              onPress={() => {}}
              style={styles.actionButton}
            >
              Pausar
            </Button>
            <Button
              variant="primary"
              onPress={() => {}}
              style={styles.actionButton}
            >
              Siguiente Set
            </Button>
          </View>

          {/* Progress bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={gradients.progress}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressFill,
                  { width: `${(completedCount / exercises.length) * 100}%` as any },
                ]}
              />
            </View>
            <Label color="chrome">{`${Math.round((completedCount / exercises.length) * 100)}% completado`}</Label>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: 4,
  },
  sessionCard: {
    marginBottom: spacing.xl,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  sessionStat: {
    alignItems: 'center',
    gap: 4,
  },
  sessionValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  sessionDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  exercisesSection: {
    marginBottom: spacing.xl,
  },
  exerciseCard: {
    marginTop: spacing.sm,
  },
  exerciseCardCurrent: {
    borderColor: 'rgba(109, 0, 255, 0.5)',
    borderWidth: 1,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exerciseStatus: {
    width: 32,
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  exerciseNameCompleted: {
    color: colors.textMuted,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  exerciseWeight: {
    fontSize: typography.fontSize.label,
    color: colors.ngx,
    fontWeight: typography.fontWeight.medium,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
  },
  progressSection: {
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Video, Dumbbell, MessageCircle, Play } from 'lucide-react-native';
import { GlassCard, Button, Label } from '@/components/ui';
import { CoachVideo, ExerciseDemo } from '@/components/video';
import { colors, spacing, typography, layout, borderRadius } from '@/constants/theme';

const COACH_VIDEO = {
  coachName: 'Diego',
  title: 'Técnica de Press Inclinado',
  duration: 95,
  recordedAt: new Date().toISOString(),
};

const DEMOS = [
  { id: '1', name: 'Sentadilla', duration: 20 },
  { id: '2', name: 'Press Banca', duration: 18 },
  { id: '3', name: 'Peso Muerto', duration: 22 },
];

export default function VideoHubScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#0D0B14', '#050505']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={['rgba(109, 0, 255, 0.1)', 'transparent']}
          style={styles.glow}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>VIDEO</Text>
            <Text style={styles.subtitle}>Aprende, analiza, mejora</Text>
          </View>

          {/* Coach Video */}
          <View style={styles.sectionHeader}>
            <Label color="mint">COACH</Label>
          </View>
          <CoachVideo
            coachName={COACH_VIDEO.coachName}
            title={COACH_VIDEO.title}
            duration={COACH_VIDEO.duration}
            recordedAt={COACH_VIDEO.recordedAt}
          />

          {/* Technique Upload */}
          <GlassCard style={styles.techniqueCard}>
            <View style={styles.techniqueHeader}>
              <View style={styles.techniqueIcon}>
                <Video size={18} color={colors.ngx} />
              </View>
              <Text style={styles.techniqueTitle}>Analiza tu técnica</Text>
            </View>
            <Text style={styles.techniqueText}>
              Graba un set corto y recibe feedback de GENESIS.
            </Text>
            <Button
              variant="primary"
              onPress={() => router.push('/(tabs)/camera')}
            >
              <Play size={16} color={colors.text} style={{ marginRight: 6 }} />
              Grabar
            </Button>
          </GlassCard>

          {/* Exercise Demos */}
          <View style={styles.sectionHeader}>
            <Label color="muted">DEMOS</Label>
            <Pressable onPress={() => router.push('/(tabs)/train')}>
              <Text style={styles.sectionLink}>Ver todo</Text>
            </Pressable>
          </View>

          <View style={styles.demoGrid}>
            {DEMOS.map((demo) => (
              <ExerciseDemo
                key={demo.id}
                exerciseName={demo.name}
                duration={demo.duration}
                size="sm"
              />
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsRow}>
            <Button
              variant="secondary"
              style={styles.actionBtn}
              onPress={() => router.push('/(tabs)/train')}
            >
              <Dumbbell size={16} color={colors.text} style={{ marginRight: 6 }} />
              Rutinas
            </Button>
            <Button
              variant="secondary"
              style={styles.actionBtn}
              onPress={() => router.push('/(tabs)/chat')}
            >
              <MessageCircle size={16} color={colors.text} style={{ marginRight: 6 }} />
              GENESIS
            </Button>
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
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  glow: {
    flex: 1,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.contentPadding,
    paddingBottom: layout.contentPaddingBottom + 20,
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 3,
    color: colors.textMuted,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.ngx,
    letterSpacing: 1,
    marginTop: 4,
    opacity: 0.8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLink: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  techniqueCard: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  techniqueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  techniqueIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  techniqueTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  techniqueText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  demoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionBtn: {
    flex: 1,
  },
});

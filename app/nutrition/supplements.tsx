import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Plus,
  ShieldCheck,
  Clock,
  Check,
  AlertCircle,
  Info,
} from 'lucide-react-native';
import { GlassCard, Button, Label, PulseDot } from '@/components/ui';
import { colors, spacing, typography, layout, borderRadius } from '@/constants/theme';

type SupplementStatus = 'verified' | 'pending' | 'suggested';

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  status: SupplementStatus;
  taken: boolean;
  notes?: string;
  coachNotes?: string;
}

// Mock data - TODO: Replace with real data from stores
const MOCK_SUPPLEMENTS: Supplement[] = [
  {
    id: '1',
    name: 'Creatina Monohidrato',
    dosage: '5g',
    timing: 'Post-entreno',
    status: 'verified',
    taken: true,
    coachNotes: 'Mantener dosis constante todos los días, incluso descanso.',
  },
  {
    id: '2',
    name: 'Vitamina D3',
    dosage: '4000 UI',
    timing: 'Mañana con desayuno',
    status: 'verified',
    taken: true,
    coachNotes: 'Importante para síntesis de proteína y energía.',
  },
  {
    id: '3',
    name: 'Omega 3',
    dosage: '2g EPA/DHA',
    timing: 'Con comida',
    status: 'verified',
    taken: false,
  },
  {
    id: '4',
    name: 'ZMA',
    dosage: '1 cápsula',
    timing: 'Antes de dormir',
    status: 'pending',
    taken: false,
    notes: 'Pendiente de aprobación del coach',
  },
  {
    id: '5',
    name: 'Magnesio Glicinato',
    dosage: '400mg',
    timing: 'Noche',
    status: 'suggested',
    taken: false,
    coachNotes: 'Recomendado para mejorar calidad de sueño.',
  },
];

const STATUS_CONFIG: Record<SupplementStatus, { label: string; color: string; icon: typeof ShieldCheck }> = {
  verified: { label: 'Coach Verified', color: colors.mint, icon: ShieldCheck },
  pending: { label: 'Pendiente', color: colors.warning, icon: Clock },
  suggested: { label: 'Sugerido', color: colors.ngx, icon: Info },
};

/**
 * SupplementsScreen - Full supplement management
 *
 * Features:
 * - View all supplements with status
 * - Coach verification badges
 * - Track daily intake
 * - Coach notes and recommendations
 */
export default function SupplementsScreen() {
  const router = useRouter();
  const [supplements, setSupplements] = useState<Supplement[]>(MOCK_SUPPLEMENTS);

  const toggleTaken = (id: string) => {
    setSupplements((prev) =>
      prev.map((s) => (s.id === id ? { ...s, taken: !s.taken } : s))
    );
  };

  const verifiedCount = supplements.filter((s) => s.status === 'verified').length;
  const takenToday = supplements.filter((s) => s.taken).length;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: 'Suplementos',
          headerTitleStyle: { color: colors.text },
          headerLeft: () => (
            <Button variant="ghost" onPress={() => router.back()}>
              <ChevronLeft size={24} color={colors.text} />
            </Button>
          ),
          headerRight: () => (
            <Pressable style={styles.headerButton}>
              <Plus size={20} color={colors.mint} />
            </Pressable>
          ),
        }}
      />

      <LinearGradient
        colors={['#0A0A0F', '#0D0B14', '#050505']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Card */}
          <GlassCard variant="hero" style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, styles.verifiedIcon]}>
                  <ShieldCheck size={20} color={colors.mint} />
                </View>
                <Text style={styles.summaryValue}>{verifiedCount}</Text>
                <Text style={styles.summaryLabel}>Verificados</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, styles.takenIcon]}>
                  <Check size={20} color={colors.text} />
                </View>
                <Text style={styles.summaryValue}>{takenToday}</Text>
                <Text style={styles.summaryLabel}>Tomados hoy</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, styles.pendingIcon]}>
                  <Clock size={20} color={colors.warning} />
                </View>
                <Text style={styles.summaryValue}>
                  {supplements.filter((s) => s.status === 'pending').length}
                </Text>
                <Text style={styles.summaryLabel}>Pendientes</Text>
              </View>
            </View>
          </GlassCard>

          {/* Coach Info */}
          <GlassCard style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <ShieldCheck size={16} color={colors.mint} />
              <Text style={styles.infoTitle}>Coach Verified</Text>
            </View>
            <Text style={styles.infoText}>
              Los suplementos marcados como "Coach Verified" han sido revisados y
              aprobados por tu coach basándose en tus objetivos y condiciones.
            </Text>
          </GlassCard>

          {/* Supplements List */}
          <Text style={styles.sectionTitle}>Tu Stack</Text>

          <View style={styles.supplementsList}>
            {supplements.map((supplement) => {
              const statusConfig = STATUS_CONFIG[supplement.status];
              const StatusIcon = statusConfig.icon;

              return (
                <GlassCard key={supplement.id} style={styles.supplementCard}>
                  <View style={styles.supplementHeader}>
                    <Pressable
                      style={[
                        styles.checkCircle,
                        supplement.taken && styles.checkCircleChecked,
                      ]}
                      onPress={() => toggleTaken(supplement.id)}
                    >
                      {supplement.taken && <Check size={16} color={colors.void} />}
                    </Pressable>

                    <View style={styles.supplementInfo}>
                      <Text
                        style={[
                          styles.supplementName,
                          supplement.taken && styles.supplementNameTaken,
                        ]}
                      >
                        {supplement.name}
                      </Text>
                      <View style={styles.supplementMeta}>
                        <Text style={styles.dosage}>{supplement.dosage}</Text>
                        <Text style={styles.metaSeparator}>•</Text>
                        <Clock size={12} color={colors.textMuted} />
                        <Text style={styles.timing}>{supplement.timing}</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${statusConfig.color}15` },
                      ]}
                    >
                      <StatusIcon size={12} color={statusConfig.color} />
                      <Text style={[styles.statusText, { color: statusConfig.color }]}>
                        {statusConfig.label}
                      </Text>
                    </View>
                  </View>

                  {/* Coach Notes */}
                  {supplement.coachNotes && (
                    <View style={styles.coachNote}>
                      <Text style={styles.coachNoteLabel}>Nota del coach:</Text>
                      <Text style={styles.coachNoteText}>{supplement.coachNotes}</Text>
                    </View>
                  )}

                  {/* Pending Notes */}
                  {supplement.notes && supplement.status === 'pending' && (
                    <View style={styles.pendingNote}>
                      <AlertCircle size={14} color={colors.warning} />
                      <Text style={styles.pendingNoteText}>{supplement.notes}</Text>
                    </View>
                  )}
                </GlassCard>
              );
            })}
          </View>

          {/* Add Supplement CTA */}
          <Pressable style={styles.addSupplementButton}>
            <Plus size={20} color={colors.mint} />
            <Text style={styles.addSupplementText}>Añadir suplemento</Text>
          </Pressable>

          <Text style={styles.disclaimer}>
            Los suplementos añadidos serán revisados por tu coach antes de ser
            verificados. Consulta siempre con un profesional de la salud.
          </Text>
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
  headerButton: {
    padding: spacing.sm,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.contentPadding,
    paddingTop: 100,
    paddingBottom: layout.contentPaddingBottom,
    gap: spacing.lg,
  },

  // Summary Card
  summaryCard: {
    borderColor: 'rgba(0, 245, 170, 0.15)',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  verifiedIcon: {
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
  },
  takenIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  pendingIcon: {
    backgroundColor: 'rgba(255, 179, 71, 0.15)',
  },
  summaryValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  summaryLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  // Info Card
  infoCard: {
    padding: spacing.md,
    backgroundColor: 'rgba(0, 245, 170, 0.05)',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  infoTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.mint,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Section
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.md,
  },

  // Supplements List
  supplementsList: {
    gap: spacing.md,
  },
  supplementCard: {
    padding: spacing.md,
  },
  supplementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkCircleChecked: {
    backgroundColor: colors.mint,
    borderColor: colors.mint,
  },
  supplementInfo: {
    flex: 1,
  },
  supplementName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: 4,
  },
  supplementNameTaken: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  supplementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dosage: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  metaSeparator: {
    color: colors.textMuted,
  },
  timing: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },

  // Coach Note
  coachNote: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  coachNoteLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.mint,
    fontWeight: typography.fontWeight.medium,
    marginBottom: 4,
  },
  coachNoteText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Pending Note
  pendingNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  pendingNoteText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.warning,
    lineHeight: 18,
  },

  // Add Button
  addSupplementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 170, 0.3)',
    borderStyle: 'dashed',
    borderRadius: borderRadius.lg,
  },
  addSupplementText: {
    fontSize: typography.fontSize.base,
    color: colors.mint,
    fontWeight: typography.fontWeight.medium,
  },

  // Disclaimer
  disclaimer: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});

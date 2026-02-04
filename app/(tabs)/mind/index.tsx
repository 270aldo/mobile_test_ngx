import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Play, Moon, Wind, Zap } from 'lucide-react-native';
import { colors, spacing, typography, layout, borderRadius } from '@/constants/theme';
import { GlassCard, Button, ScreenBackground } from '@/components/ui';
import { VisualizationPlayer } from '@/components/mindfulness';
import { useUser } from '@/stores';
import { useMindfulnessStore } from '@/stores/mindfulness';

const MORNING_SESSION_ID = 'morning';

const MORNING_SESSION = {
    id: MORNING_SESSION_ID,
    title: 'Visualización Matutina',
    durationMinutes: 5,
    category: 'Mañana',
    icon: Zap,
    color: colors.warning,
    phases: [
        { id: 'breath', name: 'Respiración', duration: 30, instruction: 'Inhala profundo. Exhala lento. Suelta la tensión.' },
        { id: 'visual', name: 'Visualización', duration: 120, instruction: 'Visualiza tu entrenamiento. Técnica limpia. Energía estable.' },
        { id: 'intent', name: 'Intención', duration: 90, instruction: 'Elige una intención clara para tu día y repítela con calma.' },
        { id: 'close', name: 'Cierre', duration: 60, instruction: 'Abre los ojos lentamente. Estás listo para tu día.' },
    ],
};

const SESSIONS = [
    {
        id: 'focus',
        title: 'Enfoque Profundo',
        durationMinutes: 20,
        category: 'Enfoque',
        icon: Zap,
        color: colors.warning,
        phases: [
            { id: 'arrive', name: 'Aterrizar', duration: 120, instruction: 'Respira profundo. Suelta cualquier ruido mental.' },
            { id: 'focus', name: 'Foco', duration: 420, instruction: 'Elige un objetivo. Visualiza tu ejecución sin interrupciones.' },
            { id: 'flow', name: 'Flow', duration: 420, instruction: 'Permanece en el presente. Mantén el ritmo con calma.' },
            { id: 'reset', name: 'Integración', duration: 240, instruction: 'Integra el enfoque. Define el siguiente paso claro.' },
        ],
    },
    {
        id: 'calm',
        title: 'Liberar Ansiedad',
        durationMinutes: 10,
        category: 'Calma',
        icon: Wind,
        color: colors.mint,
        phases: [
            { id: 'breath', name: 'Respirar', duration: 60, instruction: 'Inhala por 4, exhala por 6. Suelta el pecho.' },
            { id: 'release', name: 'Soltar', duration: 180, instruction: 'Identifica tensión. Relájala lentamente.' },
            { id: 'ground', name: 'Enraizar', duration: 240, instruction: 'Siente el cuerpo estable. Nada que resolver ahora.' },
            { id: 'close', name: 'Cerrar', duration: 120, instruction: 'Regresa con una respiración profunda.' },
        ],
    },
    {
        id: 'sleep',
        title: 'Preparar el Sueño',
        durationMinutes: 15,
        category: 'Sueño',
        icon: Moon,
        color: '#6A5ACD',
        phases: [
            { id: 'unwind', name: 'Desacelerar', duration: 90, instruction: 'Suaviza el ritmo. Relaja el cuello y la mandíbula.' },
            { id: 'body', name: 'Escaneo', duration: 300, instruction: 'Revisa tu cuerpo. Suelta cada zona con calma.' },
            { id: 'drift', name: 'Soltar el día', duration: 300, instruction: 'Deja ir lo que no necesitas hoy.' },
            { id: 'close', name: 'Transición', duration: 210, instruction: 'Respira profundo. Deja que el sueño llegue.' },
        ],
    },
];

export default function MindScreen() {
    const params = useLocalSearchParams<{ session?: string }>();
    const initialSession = typeof params.session === 'string' ? params.session : null;
    const [activeSession, setActiveSession] = useState<string | null>(initialSession);
    const user = useUser();
    const recordSession = useMindfulnessStore((s) => s.recordSession);

    const selectedSession = useMemo(() => {
        if (!activeSession) return null;
        if (activeSession === MORNING_SESSION_ID) return MORNING_SESSION;
        return SESSIONS.find((session) => session.id === activeSession) ?? null;
    }, [activeSession]);

    if (selectedSession) {
        return (
            <View style={styles.container}>
                <VisualizationPlayer
                    title={selectedSession.title}
                    totalDuration={selectedSession.durationMinutes}
                    phases={selectedSession.phases}
                    onComplete={() => {
                        if (user?.id && selectedSession) {
                            const totalSeconds = selectedSession.phases.reduce((s, p) => s + p.duration, 0);
                            recordSession(user.id, {
                                session_id: selectedSession.id,
                                session_title: selectedSession.title,
                                category: selectedSession.category,
                                duration_seconds: totalSeconds,
                                target_duration_seconds: totalSeconds,
                                completed: true,
                                phases_completed: selectedSession.phases.length,
                                total_phases: selectedSession.phases.length,
                            });
                        }
                        setActiveSession(null);
                    }}
                    onSkip={() => {
                        if (user?.id && selectedSession) {
                            const totalSeconds = selectedSession.phases.reduce((s, p) => s + p.duration, 0);
                            recordSession(user.id, {
                                session_id: selectedSession.id,
                                session_title: selectedSession.title,
                                category: selectedSession.category,
                                duration_seconds: 0,
                                target_duration_seconds: totalSeconds,
                                completed: false,
                                phases_completed: 0,
                                total_phases: selectedSession.phases.length,
                            });
                        }
                        setActiveSession(null);
                    }}
                />
            </View>
        );
    }

    return (
        <ScreenBackground
            gradientColors={['#050A14', '#0A1420', '#050505']}
            glowColors={['rgba(100, 200, 255, 0.08)', 'transparent']}
        >
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>MENTE</Text>
                        <Text style={styles.subtitle}>Claridad y Enfoque</Text>
                    </View>

                    {/* Featured: Morning Visualization */}
                    <Pressable onPress={() => setActiveSession(MORNING_SESSION_ID)}>
                        <GlassCard variant="hero" style={styles.featuredCard}>
                            <View style={styles.featuredContent}>
                                <View style={styles.featuredBadge}>
                                    <Text style={styles.featuredBadgeText}>SUGERIDO PARA LA MAÑANA</Text>
                                </View>
                                <Text style={styles.featuredTitle}>Visualización Matutina</Text>
                                <Text style={styles.featuredDesc}>Define tu intención. Visualiza el éxito. Prepárate para el día.</Text>

                                <View style={styles.featuredMeta}>
                                    <View style={styles.metaBadge}>
                                        <Play size={12} color={colors.void} fill={colors.void} />
                                        <Text style={styles.metaText}>Iniciar Sesión</Text>
                                    </View>
                                    <Text style={styles.durationText}>5 min</Text>
                                </View>
                            </View>
                        </GlassCard>
                    </Pressable>

                    {/* Categories */}
                    <View style={styles.categoriesRow}>
                        <GlassCard style={styles.categoryCard}>
                            <Wind size={24} color={colors.mint} />
                            <Text style={styles.categoryName}>Respiración</Text>
                        </GlassCard>
                        <GlassCard style={styles.categoryCard}>
                            <Moon size={24} color="#6A5ACD" />
                            <Text style={styles.categoryName}>Sueño</Text>
                        </GlassCard>
                        <GlassCard style={styles.categoryCard}>
                            <Zap size={24} color={colors.warning} />
                            <Text style={styles.categoryName}>Enfoque</Text>
                        </GlassCard>
                    </View>

                    {/* Library */}
                    <Text style={styles.sectionTitle}>Biblioteca</Text>

                    {SESSIONS.map((session) => (
                        <GlassCard key={session.id} style={styles.sessionCard}>
                            <View style={[styles.iconBox, { backgroundColor: `${session.color}20` }]}>
                                <session.icon size={20} color={session.color} />
                            </View>
                            <View style={styles.sessionInfo}>
                                <Text style={styles.sessionTitle}>{session.title}</Text>
                                <Text style={styles.sessionMeta}>{session.category} • {session.durationMinutes} min</Text>
                            </View>
                            <Button
                                size="sm"
                                variant="secondary"
                                style={{ width: 40, height: 40, borderRadius: 20, paddingHorizontal: 0 }}
                                onPress={() => setActiveSession(session.id)}
                            >
                                <Play size={16} color={colors.text} style={{ marginLeft: 2 }} />
                            </Button>
                        </GlassCard>
                    ))}

                </ScrollView>
            </SafeAreaView>
        </ScreenBackground>
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
        color: '#88CCFF',
        letterSpacing: 1,
        marginTop: 4,
        opacity: 0.8,
    },

    // Featured
    featuredCard: {
        minHeight: 180,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    featuredContent: {
        gap: spacing.sm,
    },
    featuredBadge: {
        backgroundColor: 'rgba(100, 200, 255, 0.2)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    featuredBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#88CCFF',
        letterSpacing: 1,
    },
    featuredTitle: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
    },
    featuredDesc: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    featuredMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    metaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.text,
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        borderRadius: borderRadius.full,
        gap: 6,
    },
    metaText: {
        fontSize: typography.fontSize.xs,
        fontWeight: 'bold',
        color: colors.void,
        textTransform: 'uppercase',
    },
    durationText: {
        fontSize: typography.fontSize.sm,
        color: colors.textMuted,
        fontWeight: typography.fontWeight.medium,
    },

    // Categories
    categoriesRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    categoryCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        gap: spacing.sm,
    },
    categoryName: {
        fontSize: typography.fontSize.xs,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },

    // Library
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginTop: spacing.sm,
    },
    sessionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        gap: spacing.md,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sessionInfo: {
        flex: 1,
    },
    sessionTitle: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text,
    },
    sessionMeta: {
        fontSize: typography.fontSize.xs,
        color: colors.textMuted,
        marginTop: 2,
    },
});

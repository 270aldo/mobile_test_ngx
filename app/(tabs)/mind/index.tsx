import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Moon, Wind, Focus, Zap } from 'lucide-react-native';
import { colors, spacing, typography, layout, borderRadius } from '@/constants/theme';
import { GlassCard, Button } from '@/components/ui';
import { VisualizationPlayer } from '@/components/mindfulness';

const SESSIONS = [
    { id: '1', title: 'Enfoque Profundo', duration: '20 min', category: 'Enfoque', icon: Zap, color: colors.warning },
    { id: '2', title: 'Liberar Ansiedad', duration: '10 min', category: 'Calma', icon: Wind, color: colors.mint },
    { id: '3', title: 'Preparar el Sueño', duration: '15 min', category: 'Sueño', icon: Moon, color: '#6A5ACD' },
];

export default function MindScreen() {
    const [activeSession, setActiveSession] = useState<string | null>(null);

    if (activeSession === 'morning-vis') {
        return (
            <View style={styles.container}>
                <VisualizationPlayer
                    onComplete={() => setActiveSession(null)}
                    onSkip={() => setActiveSession(null)}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#050A14', '#0A1420', '#050505']}
                locations={[0, 0.4, 1]}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.glowContainer}>
                <LinearGradient
                    colors={['rgba(100, 200, 255, 0.08)', 'transparent']}
                    style={styles.glow}
                />
            </View>

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
                    <Pressable onPress={() => setActiveSession('morning-vis')}>
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
                                <Text style={styles.sessionMeta}>{session.category} • {session.duration}</Text>
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
        height: 400,
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

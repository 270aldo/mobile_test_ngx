import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Plus, ScanLine } from 'lucide-react-native';
import { colors, spacing, typography, layout, borderRadius } from '@/constants/theme';
import { GlassCard, Button } from '@/components/ui';
import { MacroRing, MacroBar, MealCard } from '@/components/nutrition';
import { useNutritionMeals, useNutritionTargets, useNutritionTotals } from '@/stores/nutrition';

export default function NourishScreen() {
    const router = useRouter();
    const meals = useNutritionMeals();
    const targets = useNutritionTargets();
    const totals = useNutritionTotals();

    const current = useMemo(() => totals, [totals]);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0A0A0F', '#0D0B14', '#050505']}
                locations={[0, 0.4, 1]}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.glowContainer}>
                <LinearGradient
                    colors={['rgba(0, 245, 170, 0.08)', 'transparent']}
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
                        <Text style={styles.title}>NUTRICIÓN</Text>
                        <Text style={styles.subtitle}>Alimenta tu potencial</Text>
                    </View>

                    {/* Main Stats Card */}
                    <GlassCard variant="hero" style={styles.statsCard}>
                        <View style={styles.ringContainer}>
                            <MacroRing
                                current={current.calories}
                                target={targets.calories}
                                size={160}
                                showRemaining
                            />
                        </View>

                        <View style={styles.macrosContainer}>
                            <MacroBar
                                label="Proteína"
                                current={current.protein}
                                target={targets.protein}
                                color={colors.mint}
                            />
                            <MacroBar
                                label="Carbos"
                                current={current.carbs}
                                target={targets.carbs}
                                color={colors.ngx}
                            />
                            <MacroBar
                                label="Grasas"
                                current={current.fat}
                                target={targets.fat}
                                color={colors.warning}
                            />
                        </View>
                    </GlassCard>

                    {/* Quick Actions */}
                    {/* Quick Actions */}
                    <View style={styles.actionsRow}>
                        <Button
                            variant="secondary"
                            style={styles.actionBtn}
                            onPress={() => router.push('/(tabs)/camera')}
                        >
                            <ScanLine size={18} color={colors.text} style={{ marginRight: 8 }} />
                            Escanear
                        </Button>
                        <Button
                            variant="primary"
                            style={styles.actionBtn}
                            onPress={() => router.push('/nutrition/log')}
                        >
                            <Plus size={18} color={colors.text} style={{ marginRight: 8 }} />
                            Añadir
                        </Button>
                    </View>

                    {/* Meal Timeline */}
                    <Text style={styles.sectionTitle}>Línea del Día</Text>

                    <MealCard
                        type="breakfast"
                        items={meals.breakfast}
                        targetCalories={600}
                        onAddPress={() => router.push('/nutrition/log')}
                    />

                    <MealCard
                        type="lunch"
                        items={meals.lunch}
                        targetCalories={800}
                        isSuggested={true}
                        onAddPress={() => router.push('/nutrition/log')}
                    />

                    <MealCard
                        type="dinner"
                        items={meals.dinner}
                        targetCalories={700}
                        onAddPress={() => router.push('/nutrition/log')}
                    />

                    <MealCard
                        type="snacks"
                        items={meals.snacks}
                        targetCalories={300}
                        onAddPress={() => router.push('/nutrition/log')}
                    />
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
        color: colors.mint,
        letterSpacing: 1,
        marginTop: 4,
        opacity: 0.8,
    },
    statsCard: {
        padding: spacing.lg,
        alignItems: 'center',
    },
    ringContainer: {
        marginBottom: spacing.xl,
    },
    macrosContainer: {
        width: '100%',
        gap: spacing.md,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    actionBtn: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginTop: spacing.sm,
    },
});

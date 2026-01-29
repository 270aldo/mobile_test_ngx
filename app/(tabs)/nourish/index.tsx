import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, ScanLine } from 'lucide-react-native';
import { colors, spacing, typography, layout, borderRadius } from '@/constants/theme';
import { GlassCard, Button } from '@/components/ui';
import { MacroRing, MacroBar, MealCard } from '@/components/nutrition';

// Mock Data
const MOCK_MEALS = {
    breakfast: [
        { id: '1', name: 'Huevos Revueltos con Espinaca', calories: 320, protein: 22, carbs: 4, fat: 24 },
        { id: '2', name: 'Avena con Frutos Rojos', calories: 280, protein: 8, carbs: 45, fat: 6 },
    ],
    lunch: [
        { id: '3', name: 'Pollo a la Plancha', calories: 350, protein: 45, carbs: 0, fat: 12 },
        { id: '4', name: 'Arroz Integral y Quinoa', calories: 240, protein: 6, carbs: 48, fat: 3 },
    ],
    dinner: [],
    snacks: [
        { id: '5', name: 'Protein Shake', calories: 150, protein: 25, carbs: 3, fat: 2 },
    ],
};

const TARGETS = {
    calories: 2400,
    protein: 180,
    carbs: 250,
    fat: 70,
};

export default function NourishScreen() {
    const [meals, setMeals] = useState(MOCK_MEALS);

    // Calculate totals
    const allItems = [...meals.breakfast, ...meals.lunch, ...meals.dinner, ...meals.snacks];
    const current = {
        calories: allItems.reduce((sum, item) => sum + item.calories, 0),
        protein: allItems.reduce((sum, item) => sum + item.protein, 0),
        carbs: allItems.reduce((sum, item) => sum + item.carbs, 0),
        fat: allItems.reduce((sum, item) => sum + item.fat, 0),
    };

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
                                target={TARGETS.calories}
                                size={160}
                                showRemaining
                            />
                        </View>

                        <View style={styles.macrosContainer}>
                            <MacroBar
                                label="Proteína"
                                current={current.protein}
                                target={TARGETS.protein}
                                color={colors.mint}
                            />
                            <MacroBar
                                label="Carbos"
                                current={current.carbs}
                                target={TARGETS.carbs}
                                color={colors.ngx}
                            />
                            <MacroBar
                                label="Grasas"
                                current={current.fat}
                                target={TARGETS.fat}
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
                            onPress={() => console.log('Escanear')}
                        >
                            <ScanLine size={18} color={colors.text} style={{ marginRight: 8 }} />
                            Escanear
                        </Button>
                        <Button
                            variant="primary"
                            style={styles.actionBtn}
                            onPress={() => console.log('Añadir')}
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
                        onAddPress={() => { }}
                    />

                    <MealCard
                        type="lunch"
                        items={meals.lunch}
                        targetCalories={800}
                        isSuggested={true}
                        onAddPress={() => { }}
                    />

                    <MealCard
                        type="dinner"
                        items={meals.dinner}
                        targetCalories={700}
                        onAddPress={() => { }}
                    />

                    <MealCard
                        type="snacks"
                        items={meals.snacks}
                        targetCalories={300}
                        onAddPress={() => { }}
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

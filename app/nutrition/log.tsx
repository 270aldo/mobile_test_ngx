import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Search,
  Camera,
  Barcode,
  Clock,
  Star,
  Plus,
  Apple,
} from 'lucide-react-native';
import { GlassCard, Button, Label } from '@/components/ui';
import { colors, spacing, typography, layout, borderRadius } from '@/constants/theme';
import { useNutritionStore, type MealType } from '@/stores/nutrition';
import { useUser } from '@/stores';

interface QuickAddItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isFavorite?: boolean;
}

// Mock data
const RECENT_FOODS: QuickAddItem[] = [
  { id: '1', name: 'Avena con plátano', calories: 350, protein: 12, carbs: 58, fat: 8 },
  { id: '2', name: 'Huevos revueltos (3)', calories: 210, protein: 18, carbs: 2, fat: 15 },
  { id: '3', name: 'Pechuga de pollo (200g)', calories: 330, protein: 62, carbs: 0, fat: 7 },
];

const FAVORITES: QuickAddItem[] = [
  { id: '4', name: 'Proteína whey', calories: 120, protein: 24, carbs: 3, fat: 1, isFavorite: true },
  { id: '5', name: 'Arroz integral (150g)', calories: 180, protein: 4, carbs: 38, fat: 2, isFavorite: true },
  { id: '6', name: 'Plátano', calories: 105, protein: 1, carbs: 27, fat: 0, isFavorite: true },
];

/**
 * NutritionLogScreen - Add food/meal to daily log
 *
 * Features:
 * - Search food database
 * - Scan barcode
 * - Take photo for AI recognition
 * - Quick add from recents/favorites
 * - Manual entry
 */
export default function NutritionLogScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const addFood = useNutritionStore((s) => s.addFood);
  const user = useUser();

  const getSuggestedMeal = (): MealType => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'breakfast';
    if (hour >= 10 && hour < 15) return 'lunch';
    if (hour >= 15 && hour < 20) return 'dinner';
    return 'snacks';
  };

  const handleCameraPress = () => {
    // TODO: Navigate to camera with SCAN mode
    router.push('/(tabs)/camera' as any);
  };

  const handleBarcodePress = () => {
    // TODO: Navigate to camera with barcode scanner
    router.push('/(tabs)/camera' as any);
  };

  const handleAddFood = (food: QuickAddItem) => {
    addFood(getSuggestedMeal(), food, user?.id);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: 'Añadir Comida',
          headerTitleStyle: { color: colors.text },
          headerLeft: () => (
            <Button variant="ghost" onPress={() => router.back()}>
              <ChevronLeft size={24} color={colors.text} />
            </Button>
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
          keyboardShouldPersistTaps="handled"
        >
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar alimento..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Pressable style={styles.quickActionButton} onPress={handleCameraPress}>
              <View style={[styles.quickActionIcon, styles.cameraIcon]}>
                <Camera size={24} color={colors.mint} />
              </View>
              <Text style={styles.quickActionLabel}>Foto</Text>
              <Text style={styles.quickActionSubtext}>AI detecta</Text>
            </Pressable>

            <Pressable style={styles.quickActionButton} onPress={handleBarcodePress}>
              <View style={[styles.quickActionIcon, styles.barcodeIcon]}>
                <Barcode size={24} color={colors.warning} />
              </View>
              <Text style={styles.quickActionLabel}>Escanear</Text>
              <Text style={styles.quickActionSubtext}>Código barras</Text>
            </Pressable>

            <Pressable style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, styles.manualIcon]}>
                <Plus size={24} color={colors.ngx} />
              </View>
              <Text style={styles.quickActionLabel}>Manual</Text>
              <Text style={styles.quickActionSubtext}>Entrada directa</Text>
            </Pressable>
          </View>

          {/* Recent Foods */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={16} color={colors.textMuted} />
              <Text style={styles.sectionTitle}>Recientes</Text>
            </View>

            <View style={styles.foodList}>
              {RECENT_FOODS.map((food) => (
                <Pressable
                  key={food.id}
                  style={styles.foodItem}
                  onPress={() => handleAddFood(food)}
                >
                  <View style={styles.foodIcon}>
                    <Apple size={18} color={colors.textSecondary} />
                  </View>
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <View style={styles.foodMacros}>
                      <Text style={styles.foodCalories}>{food.calories} kcal</Text>
                      <Text style={styles.foodMacroDetail}>
                        P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                      </Text>
                    </View>
                  </View>
                  <View style={styles.addIcon}>
                    <Plus size={20} color={colors.mint} />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Favorites */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Star size={16} color={colors.warning} />
              <Text style={styles.sectionTitle}>Favoritos</Text>
            </View>

            <View style={styles.foodList}>
              {FAVORITES.map((food) => (
                <Pressable
                  key={food.id}
                  style={styles.foodItem}
                  onPress={() => handleAddFood(food)}
                >
                  <View style={[styles.foodIcon, styles.favoriteIcon]}>
                    <Star size={18} color={colors.warning} fill={colors.warning} />
                  </View>
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <View style={styles.foodMacros}>
                      <Text style={styles.foodCalories}>{food.calories} kcal</Text>
                      <Text style={styles.foodMacroDetail}>
                        P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                      </Text>
                    </View>
                  </View>
                  <View style={styles.addIcon}>
                    <Plus size={20} color={colors.mint} />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* AI Tips Card */}
          <GlassCard style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Camera size={16} color={colors.mint} />
              <Text style={styles.tipsTitle}>Consejo</Text>
            </View>
            <Text style={styles.tipsText}>
              Usa la cámara para tomar una foto de tu comida. GENESIS analizará
              automáticamente los ingredientes y estimará los macros.
            </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.contentPadding,
    paddingTop: 100,
    paddingBottom: layout.contentPaddingBottom,
    gap: spacing.lg,
  },

  // Search
  searchContainer: {
    gap: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
    paddingVertical: spacing.xs,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cameraIcon: {
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
  },
  barcodeIcon: {
    backgroundColor: 'rgba(255, 179, 71, 0.15)',
  },
  manualIcon: {
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
  },
  quickActionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  quickActionSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },

  // Sections
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },

  // Food List
  foodList: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  foodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    backgroundColor: 'rgba(255, 179, 71, 0.15)',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: 4,
  },
  foodMacros: {
    gap: 2,
  },
  foodCalories: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  foodMacroDetail: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  addIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 245, 170, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tips Card
  tipsCard: {
    padding: spacing.md,
    backgroundColor: 'rgba(0, 245, 170, 0.05)',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tipsTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.mint,
  },
  tipsText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

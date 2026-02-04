import { Stack } from 'expo-router';
import { colors } from '@/constants/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
        gestureEnabled: false, // Prevent back gesture during onboarding
      }}
    >
      <Stack.Screen name="index" />
      {/* Onboarding screens will be added here */}
      {/* El flujo de 14 pasos incluye:
          1. Bienvenida
          2. Objetivo principal
          3. Experiencia
          4. Métricas corporales
          5. Frecuencia de entrenamiento
          6. Equipamiento disponible
          7. Tiempo por sesión
          8. Lesiones/limitaciones
          9. Preferencias nutricionales
          10. Horario de sueño
          11. Introducción del coach
          12. Calibración de IA
          13. Selección de plan
          14. Configuración completa
      */}
    </Stack>
  );
}

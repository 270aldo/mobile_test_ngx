import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Mail, Lock, User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, GlassCard, ScreenBackground } from '@/components/ui';
import { useAuthStore, useAuthLoading } from '@/stores/auth';
import { colors, spacing, typography } from '@/constants/theme';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const signUp = useAuthStore((s) => s.signUp);
  const isLoading = useAuthLoading();

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'El nombre es obligatorio';
    }

    if (!email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ingresa un correo válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    const { error } = await signUp(email, password, fullName);
    if (error) {
      Alert.alert('Error de registro', error.message);
    } else {
      Alert.alert(
        'Revisa tu correo',
        'Te enviamos un enlace de confirmación. Revisa tu correo para completar el registro.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    }
  };

  return (
    <ScreenBackground gradientColors={[colors.background, colors.surface]}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.logo}>NGX</Text>
              <Text style={styles.title}>Crear cuenta</Text>
              <Text style={styles.subtitle}>
                Empieza tu transformación hoy
              </Text>
            </View>

            {/* Form */}
            <GlassCard style={styles.form} padding="lg">
              <Input
                label="Nombre completo"
                placeholder="Ingresa tu nombre"
                autoCapitalize="words"
                autoComplete="name"
                value={fullName}
                onChangeText={setFullName}
                error={errors.fullName}
                leftIcon={<User size={20} color={colors.textSecondary} />}
                testID="register-name-input"
              />

              <Input
                label="Correo"
                placeholder="Ingresa tu correo"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                leftIcon={<Mail size={20} color={colors.textSecondary} />}
                testID="register-email-input"
              />

              <Input
                label="Contraseña"
                placeholder="Crea una contraseña"
                secureTextEntry
                autoComplete="new-password"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                leftIcon={<Lock size={20} color={colors.textSecondary} />}
                testID="register-password-input"
              />

              <Input
                label="Confirmar contraseña"
                placeholder="Confirma tu contraseña"
                secureTextEntry
                autoComplete="new-password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirmPassword}
                leftIcon={<Lock size={20} color={colors.textSecondary} />}
                testID="register-confirm-password-input"
              />

              <Button
                onPress={handleRegister}
                loading={isLoading}
                fullWidth
                testID="register-submit-button"
              >
                Crear cuenta
              </Button>
            </GlassCard>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                ¿Ya tienes cuenta?{' '}
                <Link href="/(auth)/login" style={styles.link}>
                  Inicia sesión
                </Link>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: spacing.lg,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  link: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
});

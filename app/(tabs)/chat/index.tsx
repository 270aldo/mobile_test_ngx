import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sparkles,
  Send,
  Mic,
  Dumbbell,
  Apple,
  Heart,
  ChevronRight,
} from 'lucide-react-native';
import { GlassCard, Label, PulseDot } from '@/components/ui';
import { colors, spacing, typography, layout, borderRadius, touchTarget, avatarSizes } from '@/constants/theme';

interface ChatMessage {
  id: string;
  role: 'user' | 'genesis';
  content: string;
  timestamp: string;
}

// Mock messages
const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'genesis',
    content: 'Hola! Soy GENESIS, tu sistema de entrenamiento inteligente. Puedo ayudarte con tu programa, nutrición, recovery y cualquier duda sobre tu progreso. ¿En qué puedo ayudarte hoy?',
    timestamp: '10:30',
  },
  {
    id: '2',
    role: 'user',
    content: 'Quiero saber si debo subir el peso en bench press',
    timestamp: '10:32',
  },
  {
    id: '3',
    role: 'genesis',
    content: 'Analizando tus últimas 4 sesiones de Upper Body Push...\n\nHas completado 4x10 con 80kg consistentemente con RPE 7-8. Según tu progresión lineal, estás listo para subir.\n\n**Recomendación:** Incrementa a 82.5kg para la siguiente sesión. Mantén el mismo esquema de sets y reps.\n\n¿Quieres que actualice tu programa?',
    timestamp: '10:32',
  },
];

const quickActions = [
  { id: 'workout', icon: Dumbbell, label: 'Mi workout', prompt: 'Cuéntame sobre mi workout de hoy' },
  { id: 'nutrition', icon: Apple, label: 'Nutrición', prompt: '¿Qué debería comer hoy?' },
  { id: 'recovery', icon: Heart, label: 'Recovery', prompt: 'Dame tips de recovery para hoy' },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'genesis',
        content: 'Entendido. Analizando tu pregunta y buscando la mejor respuesta basada en tus datos de entrenamiento...',
        timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleQuickAction = (prompt: string) => {
    setInputText(prompt);
  };

  return (
    <View style={styles.container}>
      {/* Premium gradient background */}
      <LinearGradient
        colors={['#0A0A0F', '#0D0B14', '#050505']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.genesisInfo}>
            <View style={styles.genesisIcon}>
              <Sparkles size={24} color={colors.ngx} />
            </View>
            <View>
              <Text style={styles.genesisTitle}>GENESIS</Text>
              <View style={styles.statusRow}>
                <PulseDot color="mint" size={6} />
                <Text style={styles.statusText}>Activo</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <Pressable
              key={action.id}
              style={styles.quickAction}
              onPress={() => handleQuickAction(action.prompt)}
            >
              <action.icon size={16} color={colors.ngx} />
              <Text style={styles.quickActionText}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
        >
          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageRow,
                  message.role === 'user' && styles.messageRowUser,
                ]}
              >
                {message.role === 'genesis' && (
                  <View style={styles.genesisAvatar}>
                    <Sparkles size={14} color={colors.ngx} />
                  </View>
                )}

                <View
                  style={[
                    styles.messageBubble,
                    message.role === 'user' && styles.messageBubbleUser,
                  ]}
                >
                  <Text style={styles.messageText}>{message.content}</Text>
                  <Text style={styles.messageTime}>{message.timestamp}</Text>
                </View>

                {message.role === 'user' && (
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>T</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Pregunta a GENESIS..."
                placeholderTextColor={colors.textMuted}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                testID="chat-input"
              />
              <View style={styles.inputActions}>
                <Pressable style={styles.micButton}>
                  <Mic size={20} color={colors.textMuted} />
                </Pressable>
                <Pressable
                  style={[
                    styles.sendButton,
                    inputText.trim() && styles.sendButtonActive,
                  ]}
                  onPress={handleSend}
                  disabled={!inputText.trim()}
                  testID="chat-send-button"
                >
                  <Send size={18} color={inputText.trim() ? colors.void : colors.textMuted} />
                </Pressable>
              </View>
            </View>

            {/* Disclaimer */}
            <Text style={styles.disclaimer}>
              GENESIS puede cometer errores. Verifica información importante.
            </Text>
          </View>
        </KeyboardAvoidingView>
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.contentPadding,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  genesisInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  genesisIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genesisTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.ngx,
    letterSpacing: 3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    color: colors.mint,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: layout.contentPadding,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(109, 0, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.2)',
    borderRadius: borderRadius.lg,
    minHeight: touchTarget.min,
  },
  quickActionText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },

  // Messages
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: layout.contentPadding,
    paddingBottom: spacing.md,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  messageRowUser: {
    flexDirection: 'row-reverse',
  },
  genesisAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(109, 0, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.ngx,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  messageBubbleUser: {
    backgroundColor: 'rgba(109, 0, 255, 0.2)',
    borderColor: 'rgba(109, 0, 255, 0.3)',
  },
  messageText: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'right',
  },

  // Input
  inputContainer: {
    paddingHorizontal: layout.contentPadding,
    paddingBottom: spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: spacing.xs,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  micButton: {
    width: touchTarget.min,
    height: touchTarget.min,
    borderRadius: touchTarget.min / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: touchTarget.min,
    height: touchTarget.min,
    borderRadius: touchTarget.min / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.ngx,
  },
  disclaimer: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

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
  Hexagon,
  User,
  Sparkles,
  Send,
  Mic,
} from 'lucide-react-native';
import { GlassCard, Label, PulseDot } from '@/components/ui';
import { colors, spacing, typography, gradients, layout, borderRadius } from '@/constants/theme';

interface ChatMessage {
  id: string;
  role: 'user' | 'genesis';
  content: string;
  timestamp: string;
}

// Placeholder messages
const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'genesis',
    content: 'Hola! Soy GENESIS, tu asistente de entrenamiento. Puedo ayudarte con tu programa, nutrición, recovery y cualquier duda que tengas sobre tu progreso.',
    timestamp: '10:30',
  },
  {
    id: '2',
    role: 'user',
    content: 'Hola! Quiero saber si debo cambiar el peso en bench press',
    timestamp: '10:32',
  },
  {
    id: '3',
    role: 'genesis',
    content: 'Según tus últimas sesiones, has completado 4x10 con 80kg consistentemente. Te sugiero subir a 82.5kg para el próximo mesociclo. ¿Quieres que actualice tu programa?',
    timestamp: '10:32',
  },
];

/**
 * ChatScreen - GENESIS Interface
 *
 * Basado en: mobile_genesis_hybrid_v2_flow.html
 * Chat con IA para coaching, nutrición y recovery
 */
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

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={gradients.background}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Hexagon size={16} color={colors.ngx} />
              <Text style={styles.headerLogo}>NGX.GENESIS</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.avatarContainer}>
                <User size={16} color={colors.chrome} />
              </View>
            </View>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.genesisIcon}>
            <Sparkles size={24} color={colors.ngx} />
          </View>
          <View>
            <Label>Genesis Interface</Label>
            <Text style={styles.title}>PREGUNTA CUALQUIER COSA</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable style={styles.quickChip}>
            <Label color="chrome">Modificar workout</Label>
          </Pressable>
          <Pressable style={styles.quickChip}>
            <Label color="chrome">Nutrición hoy</Label>
          </Pressable>
          <Pressable style={styles.quickChip}>
            <Label color="chrome">Recovery tips</Label>
          </Pressable>
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

                <GlassCard
                  style={[
                    styles.messageBubble,
                    message.role === 'user' && styles.messageBubbleUser,
                  ]}
                >
                  <Text style={styles.messageText}>{message.content}</Text>
                  <Label color="chrome" style={styles.messageTime}>
                    {message.timestamp}
                  </Label>
                </GlassCard>

                {message.role === 'user' && (
                  <View style={styles.userAvatar}>
                    <User size={14} color={colors.text} />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <GlassCard style={styles.inputCard}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Escribe tu mensaje..."
                  placeholderTextColor={colors.chromeDark}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={500}
                  testID="chat-input"
                />
                <View style={styles.inputActions}>
                  <Pressable style={styles.micButton}>
                    <Mic size={18} color={colors.chrome} />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.sendButton,
                      !inputText.trim() && styles.sendButtonDisabled,
                    ]}
                    onPress={handleSend}
                    disabled={!inputText.trim()}
                    testID="chat-send-button"
                  >
                    <Send size={18} color={inputText.trim() ? colors.text : colors.chromeDark} />
                  </Pressable>
                </View>
              </View>
            </GlassCard>

            {/* Typing indicator */}
            <View style={styles.typingRow}>
              <PulseDot color="ngx" size={6} />
              <Label color="chrome">GENESIS puede cometer errores</Label>
            </View>
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
  header: {
    height: layout.headerHeight,
    justifyContent: 'flex-end',
    paddingHorizontal: layout.contentPadding,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogo: {
    fontSize: typography.fontSize.label,
    fontWeight: typography.fontWeight.bold,
    color: colors.ngx,
    letterSpacing: typography.letterSpacing.wider,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: layout.contentPadding,
    paddingVertical: spacing.md,
  },
  genesisIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: layout.contentPadding,
    gap: 8,
    marginBottom: spacing.md,
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.chipBorder,
    borderRadius: borderRadius.full,
  },
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
    gap: 8,
  },
  messageRowUser: {
    flexDirection: 'row-reverse',
  },
  genesisAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.ngx,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  messageBubbleUser: {
    backgroundColor: 'rgba(109, 0, 255, 0.2)',
    borderColor: 'rgba(109, 0, 255, 0.4)',
  },
  messageText: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    lineHeight: 22,
  },
  messageTime: {
    marginTop: 6,
    textAlign: 'right',
  },
  inputContainer: {
    paddingHorizontal: layout.contentPadding,
    paddingBottom: layout.contentPaddingBottom,
  },
  inputCard: {
    borderRadius: borderRadius.xl,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: 4,
  },
  inputActions: {
    flexDirection: 'row',
    gap: 8,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.ngx,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
});

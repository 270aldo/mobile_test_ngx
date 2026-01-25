import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
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
import { GlassCard, Label, PulseDot, EmptyState } from '@/components/ui';
import { colors, spacing, typography, layout, borderRadius, touchTarget, avatarSizes } from '@/constants/theme';
import { useUser } from '@/stores/auth';
import { useChatStore, useMessages, useChatLoading } from '@/stores/chat';
import { useProfile } from '@/stores/profile';

const quickActions = [
  { id: 'workout', icon: Dumbbell, label: 'Mi workout', prompt: 'Cuéntame sobre mi workout de hoy' },
  { id: 'nutrition', icon: Apple, label: 'Nutrición', prompt: '¿Qué debería comer hoy?' },
  { id: 'recovery', icon: Heart, label: 'Recovery', prompt: 'Dame tips de recovery para hoy' },
];

export default function ChatScreen() {
  const user = useUser();
  const profile = useProfile();
  const messages = useMessages();
  const isLoading = useChatLoading();
  const sendMessage = useChatStore((s) => s.sendMessage);

  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Get user initials for avatar
  const userInitials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  // Format timestamp
  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || !user?.id) return;

    const content = inputText.trim();
    setInputText('');

    await sendMessage(user.id, content);
  }, [inputText, user?.id, sendMessage]);

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
            {messages.length === 0 ? (
              <View style={styles.emptyContainer}>
                <EmptyState
                  type="messages"
                  title="Comienza una conversación"
                  message="Pregunta algo a GENESIS sobre tu entrenamiento"
                />
              </View>
            ) : (
              messages.map((message) => {
                const isUser = message.role === 'user';
                const isGenesis = message.role === 'genesis';
                const isCoach = message.role === 'coach';

                return (
                  <View
                    key={message.id}
                    style={[
                      styles.messageRow,
                      isUser && styles.messageRowUser,
                    ]}
                  >
                    {(isGenesis || isCoach) && (
                      <View style={[styles.genesisAvatar, isCoach && styles.coachAvatar]}>
                        <Sparkles size={14} color={isCoach ? colors.mint : colors.ngx} />
                      </View>
                    )}

                    <View
                      style={[
                        styles.messageBubble,
                        isUser && styles.messageBubbleUser,
                        isCoach && styles.messageBubbleCoach,
                      ]}
                    >
                      <Text style={styles.messageText}>{message.content}</Text>
                      <Text style={styles.messageTime}>{formatTime(message.created_at)}</Text>
                    </View>

                    {isUser && (
                      <View style={styles.userAvatar}>
                        <Text style={styles.userAvatarText}>{userInitials}</Text>
                      </View>
                    )}
                  </View>
                );
              })
            )}

            {/* Loading indicator when sending */}
            {isLoading && (
              <View style={styles.messageRow}>
                <View style={styles.genesisAvatar}>
                  <Sparkles size={14} color={colors.ngx} />
                </View>
                <View style={styles.typingBubble}>
                  <ActivityIndicator size="small" color={colors.ngx} />
                </View>
              </View>
            )}
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

  // Empty state container
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },

  // Coach styles
  coachAvatar: {
    backgroundColor: 'rgba(0, 245, 170, 0.2)',
    borderColor: 'rgba(0, 245, 170, 0.3)',
  },
  messageBubbleCoach: {
    backgroundColor: 'rgba(0, 245, 170, 0.1)',
    borderColor: 'rgba(0, 245, 170, 0.2)',
  },

  // Typing indicator
  typingBubble: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textMuted,
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
  },
});

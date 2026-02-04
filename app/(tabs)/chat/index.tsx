import { useState, useRef, useCallback, useMemo } from 'react';
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
import {
  Sparkles,
  Send,
  Mic,
  Dumbbell,
  Apple,
  Heart,
  User,
} from 'lucide-react-native';
import { PulseDot, EmptyState, ScreenBackground } from '@/components/ui';
import { CoachNoteMessage } from '@/components/chat';
import { colors, spacing, typography, layout, borderRadius, touchTarget } from '@/constants/theme';
import { useUser } from '@/stores/auth';
import { useChatStore, useMessages, useChatLoading } from '@/stores/chat';
import { useProfile } from '@/stores/profile';
import { useCoachNotesByLocation } from '@/hooks/useCoachNotes';

const quickActions = [
  { id: 'workout', icon: Dumbbell, label: 'Mi workout', prompt: 'Cuéntame sobre mi workout de hoy' },
  { id: 'nutrition', icon: Apple, label: 'Nutrición', prompt: '¿Qué debería comer hoy?' },
  { id: 'recovery', icon: Heart, label: 'Recovery', prompt: 'Dame tips de recovery para hoy' },
];

// Mock coach data - TODO: Get from profile/settings
const COACH_INFO = {
  name: 'Diego',
  whatsappNumber: '+521234567890',
};

/**
 * ChatScreen - GENESIS Chat Interface
 *
 * Philosophy: GENESIS is the ONLY voice in the chat.
 * Coach Notes appear as differentiated cards (mint).
 * User responds to coach via WhatsApp (CTA in card).
 * GENESIS contextualizes: "Basado en la nota de Diego, ajusté..."
 */
export default function ChatScreen() {
  const user = useUser();
  const profile = useProfile();
  const messages = useMessages();
  const isLoading = useChatLoading();
  const sendMessage = useChatStore((s) => s.sendMessage);

  // Coach notes for chat location
  const chatNotes = useCoachNotesByLocation('chat');

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

  // Format time ago
  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'hace unos minutos';
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays === 1) return 'ayer';
    return `hace ${diffDays} días`;
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

  // Combine messages with coach notes for unified timeline
  const combinedMessages = useMemo(() => {
    const items: {
      type: 'message' | 'coach_note' | 'genesis_context';
      data: any;
      timestamp: number;
    }[] = [];

    // Add regular messages
    messages.forEach((msg) => {
      items.push({
        type: 'message',
        data: msg,
        timestamp: msg.created_at ? new Date(msg.created_at).getTime() : 0,
      });
    });

    // Add coach notes as special items
    chatNotes.forEach((note) => {
      items.push({
        type: 'coach_note',
        data: note,
        timestamp: note.created_at ? new Date(note.created_at).getTime() : 0,
      });

      // Add GENESIS context message after coach note
      if (note.cta_action) {
        items.push({
          type: 'genesis_context',
          data: {
            content: `Basado en la nota de ${COACH_INFO.name}, he actualizado tu plan. ${note.cta_text || 'Revisa los cambios.'}`,
            noteId: note.id,
          },
          timestamp: (note.created_at ? new Date(note.created_at).getTime() : 0) + 1,
        });
      }
    });

    // Sort by timestamp
    return items.sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, chatNotes]);

  return (
    <ScreenBackground>
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

          {/* Coach indicator */}
          {chatNotes.length > 0 && (
            <View style={styles.coachIndicator}>
              <User size={14} color={colors.mint} />
              <Text style={styles.coachIndicatorText}>
                {chatNotes.length} nota{chatNotes.length > 1 ? 's' : ''} del coach
              </Text>
            </View>
          )}
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
            onContentSizeChange={() => {
              requestAnimationFrame(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              });
            }}
          >
            {combinedMessages.length === 0 ? (
              <View style={styles.emptyContainer}>
                <EmptyState
                  type="messages"
                  title="Comienza una conversación"
                  message="Pregunta algo a GENESIS sobre tu entrenamiento"
                />
              </View>
            ) : (
              combinedMessages.map((item, index) => {
                // Render coach note
                if (item.type === 'coach_note') {
                  return (
                    <CoachNoteMessage
                      key={`note-${item.data.id}`}
                      coachName={COACH_INFO.name}
                      content={item.data.content}
                      timeAgo={formatTimeAgo(item.data.created_at)}
                      whatsappNumber={COACH_INFO.whatsappNumber}
                    />
                  );
                }

                // Render GENESIS context message
                if (item.type === 'genesis_context') {
                  return (
                    <View key={`context-${item.data.noteId}`} style={styles.messageRow}>
                      <View style={styles.genesisAvatar}>
                        <Sparkles size={14} color={colors.ngx} />
                      </View>
                      <View style={styles.contextBubble}>
                        <Text style={styles.contextText}>{item.data.content}</Text>
                      </View>
                    </View>
                  );
                }

                // Render regular message
                const message = item.data;
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
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  coachIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(0, 245, 170, 0.1)',
    borderRadius: borderRadius.full,
  },
  coachIndicatorText: {
    fontSize: typography.fontSize.xs,
    color: colors.mint,
    fontWeight: typography.fontWeight.medium,
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

  // Context bubble (GENESIS response to coach note)
  contextBubble: {
    maxWidth: '75%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(109, 0, 255, 0.08)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.15)',
    borderLeftWidth: 3,
    borderLeftColor: colors.ngx,
  },
  contextText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
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
});

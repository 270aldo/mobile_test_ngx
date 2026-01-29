/**
 * Chat Store
 *
 * Manages chat messages with GENESIS and coach
 *
 * IMPORTANT: Always use selectors to access state to prevent unnecessary re-renders
 */

import { create } from 'zustand';
import { chatApi } from '@/services/api';
import type { Message } from '@/types';

interface ChatState {
  messages: Message[];
  unreadCount: number;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  _messageChannel: ReturnType<typeof import('@supabase/supabase-js').SupabaseClient.prototype.channel> | null;
}

interface ChatActions {
  fetchMessages: (userId: string) => Promise<void>;
  sendMessage: (userId: string, content: string) => Promise<void>;
  markAsRead: (userId: string) => Promise<void>;
  subscribeToMessages: (userId: string) => void;
  unsubscribe: (userId: string) => void;
  addMessage: (message: Message) => void;
  reset: () => void;
}

type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
  messages: [],
  unreadCount: 0,
  isLoading: false,
  isSending: false,
  error: null,
  _messageChannel: null,
};

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialState,

  /**
   * Fetch messages
   */
  fetchMessages: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const [messages, unreadCount] = await Promise.all([
        chatApi.getRecentMessages(userId),
        chatApi.getUnreadCount(userId),
      ]);
      set({ messages, unreadCount, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch messages',
      });
    }
  },

  /**
   * Send a message
   */
  sendMessage: async (userId: string, content: string) => {
    set({ isSending: true, error: null });

    try {
      const message = await chatApi.sendMessage(userId, content);
      set((state) => ({
        messages: [...state.messages, message],
        isSending: false,
      }));
    } catch (error) {
      set({
        isSending: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      });
    }
  },

  /**
   * Mark messages as read
   */
  markAsRead: async (userId: string) => {
    try {
      await chatApi.markAsRead(userId);
      set({ unreadCount: 0 });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  },

  /**
   * Subscribe to realtime messages
   */
  subscribeToMessages: (userId: string) => {
    // Clean up existing channel first
    const existing = get()._messageChannel;
    if (existing) {
      existing.unsubscribe();
    }

    const channel = chatApi.subscribeToMessages(userId, (message) => {
      set((state) => ({
        messages: [...state.messages, message],
        unreadCount: message.role !== 'user' ? state.unreadCount + 1 : state.unreadCount,
      }));
    });
    set({ _messageChannel: channel });
  },

  /**
   * Unsubscribe from realtime messages
   */
  unsubscribe: (userId: string) => {
    const channel = get()._messageChannel;
    if (channel) {
      channel.unsubscribe();
      set({ _messageChannel: null });
    } else {
      chatApi.unsubscribeFromMessages(userId);
    }
  },

  /**
   * Add a message to the store (for optimistic updates)
   */
  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  /**
   * Reset store state
   */
  reset: () => set(initialState),
}));

// Selector hooks
export const useMessages = () => useChatStore((s) => s.messages);
export const useUnreadCount = () => useChatStore((s) => s.unreadCount);
export const useChatLoading = () => useChatStore((s) => s.isLoading);
export const useChatSending = () => useChatStore((s) => s.isSending);
export const useChatError = () => useChatStore((s) => s.error);

// Derived selectors
export const useLastMessage = () => useChatStore((s) => s.messages[s.messages.length - 1] ?? null);
export const useHasUnread = () => useChatStore((s) => s.unreadCount > 0);

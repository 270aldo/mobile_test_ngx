/**
 * Chat API Service
 *
 * Operations for messages with GENESIS and coach
 */

import { supabase } from '@/lib/supabase';
import { handleQueryResult, handleQueryResultOrNull } from './base';
import type { Message, Json } from '@/types';

export const chatApi = {
  /**
   * Get messages for user (paginated)
   */
  getMessages: async (
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Message[]> => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Reverse to get chronological order
    const messages = handleQueryResult(data ?? [], error);
    return messages.reverse();
  },

  /**
   * Get recent messages (for display)
   */
  getRecentMessages: async (
    userId: string,
    limit: number = 20
  ): Promise<Message[]> => {
    return chatApi.getMessages(userId, limit, 0);
  },

  /**
   * Send a user message
   */
  sendMessage: async (
    userId: string,
    content: string,
    messageType: 'text' | 'voice' | 'image' = 'text',
    attachments?: Json
  ): Promise<Message> => {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        user_id: userId,
        role: 'user',
        content,
        message_type: messageType,
        attachments: attachments ?? null,
      })
      .select()
      .single();

    return handleQueryResult(data, error);
  },

  /**
   * Get unread message count
   */
  getUnreadCount: async (userId: string): Promise<number> => {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .neq('role', 'user')
      .is('read_at', null);

    if (error) return 0;
    return count ?? 0;
  },

  /**
   * Mark messages as read
   */
  markAsRead: async (userId: string): Promise<void> => {
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .neq('role', 'user')
      .is('read_at', null);
  },

  /**
   * Get last message (for preview)
   */
  getLastMessage: async (userId: string): Promise<Message | null> => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return handleQueryResultOrNull(data, error);
  },

  /**
   * Subscribe to new messages (realtime)
   */
  subscribeToMessages: (
    userId: string,
    callback: (message: Message) => void
  ) => {
    return supabase
      .channel(`messages:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();
  },

  /**
   * Unsubscribe from messages
   */
  unsubscribeFromMessages: (userId: string) => {
    return supabase.channel(`messages:${userId}`).unsubscribe();
  },
};

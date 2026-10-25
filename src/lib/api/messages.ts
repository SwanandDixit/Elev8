import { supabase, isDemo } from '../supabase';
import type { Message } from '../../types';

// ── Fetch conversation between two users ──────────────────────
export async function fetchConversation(userId: string, otherUserId: string) {
  if (isDemo) return { data: [], error: null };
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(
      `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),` +
      `and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
    )
    .order('sent_at', { ascending: true });
  return { data: data as Message[], error };
}

// ── Send a message ────────────────────────────────────────────
export async function sendMessage(senderId: string, receiverId: string, content: string, jobId?: string) {
  if (isDemo) {
    const msg: Message = {
      id: 'demo-' + Date.now(), sender_id: senderId,
      receiver_id: receiverId, content,
      job_id: jobId, is_read: false,
      sent_at: new Date().toISOString(),
    };
    return { data: msg, error: null };
  }
  const { data, error } = await supabase
    .from('messages')
    .insert({ sender_id: senderId, receiver_id: receiverId, content, job_id: jobId })
    .select()
    .single();
  return { data: data as Message | null, error };
}

// ── Mark messages as read ─────────────────────────────────────
export async function markMessagesRead(receiverId: string, senderId: string) {
  if (isDemo) return { error: null };
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('receiver_id', receiverId)
    .eq('sender_id', senderId)
    .eq('is_read', false);
  return { error };
}

// ── Get unread message count ──────────────────────────────────
export async function fetchUnreadCount(userId: string) {
  if (isDemo) return { count: 0, error: null };
  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('is_read', false);
  return { count: count || 0, error };
}

// ── Subscribe to real-time messages ──────────────────────────
export function subscribeToMessages(userId: string, onMessage: (msg: Message) => void) {
  if (isDemo) return { unsubscribe: () => {} };
  const channel = supabase
    .channel('messages-' + userId)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${userId}` },
      (payload) => onMessage(payload.new as Message)
    )
    .subscribe();
  return { unsubscribe: () => supabase.removeChannel(channel) };
}

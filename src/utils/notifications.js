/**
 * Notification Service
 * Handles sending notifications via various channels.
 * Note: In a real app, this would call a backend API (Edge Function) to keep keys secure.
 */

import { supabase } from '@/lib/supabase';

export const sendNotification = async (channel, recipient, message) => {
  console.log(`Sending ${channel} notification to ${recipient}: ${message}`);
  
  try {
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: { channel, recipient, message }
    });

    if (error) throw error;
    return { success: true, message: `Sent to ${channel}`, data };
  } catch (error) {
    console.error('Notification error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
    }
    // Check for common Supabase Edge Function errors
    if (error.message === 'Failed to send a request to the Edge Function') {
      console.warn('HINT: Is the Edge Function running? Run "supabase functions serve" locally.');
    }
    // Return success: false but don't crash the UI, let the caller handle the toast
    return { success: false, message: error.message || 'Failed to send notification' };
  }
};

export const NOTIFICATION_CHANNELS = [
  { id: 'email', label: 'Email', icon: 'Mail' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle' },
  { id: 'telegram', label: 'Telegram', icon: 'Send' },
  { id: 'sms', label: 'SMS', icon: 'Smartphone' },
];

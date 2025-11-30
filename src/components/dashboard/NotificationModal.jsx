import React from 'react';
import { Mail, MessageCircle, Send, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NOTIFICATION_CHANNELS } from '@/utils/notifications';

export default function NotificationModal({ open, onOpenChange, student, onSend }) {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notify {student.name}</DialogTitle>
          <DialogDescription>
            Choose a channel to send a notification to the student.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {NOTIFICATION_CHANNELS.map(channel => (
            <Button
              key={channel.id}
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
              onClick={() => onSend(channel.id)}
            >
              {channel.id === 'email' && <Mail size={24} className="text-blue-500" />}
              {channel.id === 'whatsapp' && <MessageCircle size={24} className="text-green-500" />}
              {channel.id === 'telegram' && <Send size={24} className="text-sky-500" />}
              {channel.id === 'sms' && <Smartphone size={24} className="text-gray-500" />}
              {channel.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

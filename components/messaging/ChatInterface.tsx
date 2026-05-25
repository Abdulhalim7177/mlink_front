import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import api from '@/lib/api';
import { format } from 'date-fns';

interface ChatInterfaceProps {
  conversation: any;
  currentUserId: string;
  onMessageSent: () => void;
}

export function ChatInterface({ conversation, currentUserId, onMessageSent }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Derive other participant
  const isParticipantA = conversation.participantAId === currentUserId;
  const otherParticipant = isParticipantA ? conversation.participantB : conversation.participantA;
  const profile = otherParticipant?.profile;
  const displayName = profile?.businessName || (profile?.firstName ? `${profile.firstName} ${profile.lastName}` : 'Unknown User');

  useEffect(() => {
    fetchMessages();
    markAsRead();
    
    // Connect to WebSocket
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
      withCredentials: true,
    });
    
    socketRef.current = socket;

    socket.emit('join_conversation', conversation.id);

    socket.on('new_message', (message: any) => {
      if (message.conversationId === conversation.id) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.find(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
        
        // If message is from other user, mark as read
        if (message.senderId !== currentUserId) {
          markAsRead();
        }
      }
    });

    return () => {
      socket.emit('leave_conversation', conversation.id);
      socket.disconnect();
    };
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/messages/conversations/${conversation.id}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await api.post(`/messages/conversations/${conversation.id}/read`);
      onMessageSent(); // Trigger conversation list update to clear unread indicator
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsSending(true);
    try {
      const response = await api.post('/messages', {
        recipientId: otherParticipant.id,
        content: inputValue.trim()
      });
      
      // Clear input
      setInputValue('');
      onMessageSent(); // Update conversation list
      
      // Socket will broadcast the new message, so we don't manually append it here to avoid duplicates
      // Wait, let's append optimistically or just wait for socket event
      // If we don't append it might feel slightly lagged. Let's append if socket fails, or rely on socket.
      // Actually, relying on socket ensures consistency. Let's append optimistically for better UX:
      setMessages(prev => [...prev, response.data.data.message]);

    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center shadow-sm z-10">
        <div className="h-10 w-10 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center mr-3">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{displayName}</h3>
          <p className="text-xs text-green-600 font-medium">Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUserId;
          const showTime = index === 0 || new Date(msg.createdAt).getTime() - new Date(messages[index - 1].createdAt).getTime() > 5 * 60 * 1000;

          return (
            <div key={msg.id || index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              {showTime && (
                <span className="text-[10px] text-gray-400 mb-1 mx-2">
                  {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                </span>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                isMe 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className="h-11 w-11 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

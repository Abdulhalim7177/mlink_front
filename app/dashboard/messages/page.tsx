'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConversationList } from '@/components/messaging/ConversationList';
import { ChatInterface } from '@/components/messaging/ChatInterface';
import { ShieldAlert } from 'lucide-react';
import api from '@/lib/api';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationParam = searchParams.get('conversation');

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(conversationParam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data.data || []);
      
      // Auto-select first conversation if exists and none selected
      if (!activeConversationId && !conversationParam && response.data.data?.length > 0) {
        setActiveConversationId(response.data.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="h-[calc(100vh-64px)] bg-white flex overflow-hidden">
      {/* Sidebar: Conversation List */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 bg-white shadow-sm z-10">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList 
            conversations={conversations} 
            activeId={activeConversationId}
            onSelect={setActiveConversationId}
            loading={loading}
            currentUserId={user?.id || ''}
          />
        </div>
      </div>

      {/* Main Content: Chat Interface */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        {activeConversationId ? (
          <ChatInterface 
            conversation={activeConversation}
            currentUserId={user?.id || ''}
            onMessageSent={fetchConversations}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            {conversations.length === 0 ? 'No conversations yet' : 'Select a conversation to start chatting'}
          </div>
        )}
      </div>
    </div>
  );
}

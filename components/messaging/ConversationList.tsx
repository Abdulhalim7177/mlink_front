import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface ConversationListProps {
  conversations: any[];
  activeId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
  currentUserId: string;
}

export function ConversationList({ conversations, activeId, onSelect, loading, currentUserId }: ConversationListProps) {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500 h-full">
        <MessageCircle className="w-12 h-12 text-gray-300 mb-4" />
        <p>No conversations yet.</p>
        <p className="text-sm text-gray-400 mt-2 text-center">Inquire on a listing to start a chat.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conv) => {
        // Determine the other participant
        const isParticipantA = conv.participantAId === currentUserId;
        const otherParticipant = isParticipantA ? conv.participantB : conv.participantA;
        const profile = otherParticipant?.profile;
        const displayName = profile?.businessName || (profile?.firstName ? `${profile.firstName} ${profile.lastName}` : 'Unknown User');
        
        const lastMessage = conv.messages?.[0];
        const isUnread = lastMessage && !lastMessage.isRead && lastMessage.senderId !== currentUserId;

        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${activeId === conv.id ? 'bg-primary/5 border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex flex-col">
                <span className={`font-semibold truncate ${isUnread ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
                  {displayName}
                </span>
                {conv.inquiry && (
                  <span className="text-xs text-primary font-medium truncate mt-0.5">
                    {conv.inquiry.listing ? `Re: ${conv.inquiry.listing.commodityType}` : 'Direct Inquiry'}
                  </span>
                )}
              </div>
              {lastMessage && (
                <span className="text-xs text-gray-400 whitespace-nowrap ml-2 mt-1">
                  {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
                </span>
              )}
            </div>
            {lastMessage && (
              <div className="flex justify-between items-center">
                <p className={`text-sm truncate pr-4 ${isUnread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                  {lastMessage.senderId === currentUserId ? 'You: ' : ''}{lastMessage.content}
                </p>
                {isUnread && (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full shrink-0"></div>
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

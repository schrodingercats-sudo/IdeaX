
import React, { useState, useRef, useEffect } from 'react';
import { User, Conversation, Message } from '../types';
import { Send, ChevronLeft } from 'lucide-react';

const ConversationItem: React.FC<{
    conversation: Conversation;
    currentUser: User;
    isActive: boolean;
    onSelect: (id: string) => void;
}> = ({ conversation, currentUser, isActive, onSelect }) => {
    const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
    if (!otherParticipant) return null;

    // FIX: The `.at()` method is not available in all JS environments. Replaced with `[arr.length - 1]` for wider compatibility.
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    return (
        <button
            onClick={() => onSelect(conversation.id)}
            className={`w-full text-left p-3 flex items-center rounded-lg transition-colors ${isActive ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
        >
            <img src={otherParticipant.avatarUrl} alt={otherParticipant.displayName} className="h-12 w-12 rounded-full object-cover" />
            <div className="ml-3 flex-1 overflow-hidden">
                <p className="font-bold truncate">{otherParticipant.displayName}</p>
                <p className="text-sm text-muted-foreground truncate">
                    {lastMessage ? lastMessage.text : 'Start a conversation'}
                </p>
            </div>
        </button>
    );
};

const ChatBubble: React.FC<{ message: Message; isCurrentUser: boolean }> = ({ message, isCurrentUser }) => (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
            <p>{message.text}</p>
        </div>
    </div>
);

export const MessagesPage: React.FC<{
    conversations: Conversation[];
    activeConversation: Conversation | null;
    onSelectConversation: (id: string | null) => void;
    onSendMessage: (conversationId: string, text: string) => void;
    currentUser: User;
}> = ({ conversations, activeConversation, onSelectConversation, onSendMessage, currentUser }) => {
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeConversation?.messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageText.trim() && activeConversation) {
            onSendMessage(activeConversation.id, messageText.trim());
            setMessageText('');
        }
    };

    const otherParticipant = activeConversation?.participants.find(p => p.id !== currentUser.id);

    return (
        <div className="h-full w-full flex flex-row">
            {/* Conversation List */}
            <div className={`h-full flex flex-col border-r border-border/50 w-full md:w-1/3 transition-transform duration-300 ease-in-out ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-border/50">
                    <h1 className="text-xl font-bold">Messages</h1>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar p-2">
                    {conversations.map(conv => (
                        <ConversationItem
                            key={conv.id}
                            conversation={conv}
                            currentUser={currentUser}
                            isActive={activeConversation?.id === conv.id}
                            onSelect={onSelectConversation}
                        />
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`h-full flex flex-col w-full md:w-2/3 transition-transform duration-300 ease-in-out ${activeConversation ? 'flex' : 'hidden md:flex'}`}>
                {activeConversation && otherParticipant ? (
                    <>
                        <header className="flex items-center p-3 border-b border-border/50">
                            <button onClick={() => onSelectConversation(null)} className="md:hidden mr-2 p-2 rounded-full hover:bg-secondary">
                                <ChevronLeft size={20} />
                            </button>
                            <img src={otherParticipant.avatarUrl} alt={otherParticipant.displayName} className="h-10 w-10 rounded-full object-cover" />
                            <div className="ml-3">
                                <p className="font-bold">{otherParticipant.displayName}</p>
                                <p className="text-xs text-muted-foreground">@{otherParticipant.username}</p>
                            </div>
                        </header>
                        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                            {activeConversation.messages.map(msg => (
                                <ChatBubble
                                    key={msg.id}
                                    message={msg}
                                    isCurrentUser={msg.senderId === currentUser.id}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSend} className="p-4 border-t border-border/50 flex items-center gap-2">
                            <input
                                type="text"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full bg-secondary px-4 py-2 rounded-full border border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                            <button type="submit" className="bg-primary p-2 rounded-full text-primary-foreground hover:bg-primary/90 disabled:opacity-50" disabled={!messageText.trim()}>
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="h-full w-full hidden md:flex flex-col items-center justify-center text-muted-foreground">
                        <Send size={48} />
                        <h2 className="mt-4 text-xl font-bold">Your Messages</h2>
                        <p>Select a conversation to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

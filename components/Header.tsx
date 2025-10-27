
import React from 'react';
import { Search, Bell, Send } from 'lucide-react';
import { User, Page } from '../types';

interface HeaderProps {
    onOpenProfile: (user: User) => void;
    currentUser: User;
    onNavigate: (page: Page) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile, currentUser, onNavigate }) => {
    return (
        <header className="md:hidden absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 bg-gradient-to-b from-black/60 to-transparent">
            <h1 className="text-2xl font-bold text-white tracking-tighter">IdeaX</h1>
            <div className="flex items-center space-x-4">
                <button onClick={() => onNavigate('search')} className="text-white/80 hover:text-white transition-colors" aria-label="Search">
                    <Search size={22} />
                </button>
                 <button onClick={() => onNavigate('notifications')} className="text-white/80 hover:text-white transition-colors relative" aria-label="Notifications">
                    <Bell size={22} />
                    <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                 <button onClick={() => onNavigate('messages')} className="text-white/80 hover:text-white transition-colors" aria-label="Messages">
                    <Send size={22} />
                </button>
                <button onClick={() => onOpenProfile(currentUser)} aria-label="View profile">
                    <img 
                        src={currentUser.avatarUrl} 
                        alt={currentUser.displayName}
                        className="h-8 w-8 rounded-full border-2 border-white/50 object-cover"
                    />
                </button>
            </div>
        </header>
    );
};

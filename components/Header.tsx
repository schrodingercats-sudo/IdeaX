import React from 'react';
import { Search, Bell } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
    onOpenProfile: (user: User) => void;
    currentUser: User;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile, currentUser }) => {
    return (
        <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 md:p-4 bg-gradient-to-b from-black/60 to-transparent">
            <h1 className="text-2xl font-bold text-white tracking-tighter">IdeaX</h1>
            <div className="flex items-center space-x-4">
                <button onClick={() => console.log('Search clicked')} className="text-white/80 hover:text-white transition-colors" aria-label="Search">
                    <Search size={22} />
                </button>
                 <button onClick={() => console.log('Notifications clicked')} className="text-white/80 hover:text-white transition-colors relative" aria-label="Notifications">
                    <Bell size={22} />
                    <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500"></span>
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
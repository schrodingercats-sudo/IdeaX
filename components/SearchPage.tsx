
import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { Search } from 'lucide-react';

interface SearchPageProps {
    users: User[];
    onStartConversation: (user: User) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ users, onStartConversation }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;
        const lowercasedQuery = searchQuery.toLowerCase();
        return users.filter(user => 
            user.displayName.toLowerCase().includes(lowercasedQuery) ||
            user.username.toLowerCase().includes(lowercasedQuery)
        );
    }, [users, searchQuery]);

    return (
        <div className="h-full w-full flex flex-col">
            <div className="hidden md:block p-4 border-b border-border/50">
                 <h1 className="text-2xl font-bold">Search</h1>
            </div>

            <div className="p-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search for users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-secondary pl-10 pr-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 no-scrollbar">
                {filteredUsers.length > 0 ? (
                    <div className="divide-y divide-border/50">
                        {filteredUsers.map(user => (
                            <div key={user.id} className="flex items-center py-3">
                                <img src={user.avatarUrl} alt={user.displayName} className="h-10 w-10 rounded-full object-cover" />
                                <div className="ml-3 flex-1">
                                    <p className="font-bold">{user.displayName}</p>
                                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                                </div>
                                <button
                                    onClick={() => onStartConversation(user)}
                                    className="bg-secondary text-foreground font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-muted"
                                >
                                    Message
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        <p className="font-semibold">No users found</p>
                        <p className="text-sm">Try searching for someone else.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

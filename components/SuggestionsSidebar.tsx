
import React, { useMemo, useState } from 'react';
import { User, Post } from '../types';

const SuggestionItem: React.FC<{ user: User, onFollow: (id: string) => void, isFollowing: boolean }> = ({ user, onFollow, isFollowing }) => (
    <div className="flex items-center">
        <img src={user.avatarUrl} alt={user.displayName} className="h-8 w-8 rounded-full object-cover"/>
        <div className="ml-3 flex-1">
            <p className="text-sm font-bold">{user.username}</p>
            <p className="text-xs text-muted-foreground">Suggested for you</p>
        </div>
        <button 
            onClick={() => onFollow(user.id)}
            className="text-xs font-bold text-primary hover:text-foreground"
        >
            {isFollowing ? 'Following' : 'Follow'}
        </button>
    </div>
);


interface SuggestionsSidebarProps {
    currentUser: User;
    posts: Post[];
    onOpenProfile: (user: User) => void;
}

export const SuggestionsSidebar: React.FC<SuggestionsSidebarProps> = ({ currentUser, posts, onOpenProfile }) => {
    const [followedUsers, setFollowedUsers] = useState<Record<string, boolean>>({});

    const suggestedUsers = useMemo(() => {
        const uniqueAuthors: User[] = [];
        const authorIds = new Set<string>();
        for (const post of posts) {
            if (post.author.id !== currentUser.id && !authorIds.has(post.author.id)) {
                uniqueAuthors.push(post.author);
                authorIds.add(post.author.id);
            }
            if (uniqueAuthors.length >= 5) break;
        }
        return uniqueAuthors;
    }, [posts, currentUser.id]);

    const handleFollow = (userId: string) => {
        setFollowedUsers(prev => ({ ...prev, [userId]: !prev[userId] }));
    };

    return (
        <aside className="hidden lg:block w-[320px] xl:w-[380px] flex-shrink-0 pt-8 pl-8 pr-4">
            <div className="flex items-center mb-6">
                <button onClick={() => onOpenProfile(currentUser)}>
                    <img src={currentUser.avatarUrl} alt={currentUser.displayName} className="h-14 w-14 rounded-full object-cover"/>
                </button>
                <div className="ml-4 flex-1">
                    <button onClick={() => onOpenProfile(currentUser)}>
                        <p className="text-sm font-bold">{currentUser.username}</p>
                        <p className="text-sm text-muted-foreground">{currentUser.displayName}</p>
                    </button>
                </div>
                <button className="text-xs font-bold text-primary hover:text-foreground">Switch</button>
            </div>
            
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-bold text-muted-foreground">Suggested for you</p>
                <button className="text-xs font-bold">See All</button>
            </div>
            
            <div className="space-y-4">
                {suggestedUsers.map(user => (
                    <SuggestionItem 
                        key={user.id} 
                        user={user} 
                        onFollow={handleFollow}
                        isFollowing={!!followedUsers[user.id]}
                    />
                ))}
            </div>

            <footer className="mt-8 text-xs text-muted-foreground/50">
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                   <a href="#" className="hover:underline">About</a>•
                   <a href="#" className="hover:underline">Help</a>•
                   <a href="#" className="hover:underline">Press</a>•
                   <a href="#" className="hover:underline">API</a>•
                   <a href="#" className="hover:underline">Jobs</a>•
                   <a href="#" className="hover:underline">Privacy</a>•
                   <a href="#" className="hover:underline">Terms</a>•
                   <a href="#" className="hover:underline">Locations</a>•
                   <a href="#" className="hover:underline">Language</a>•
                   <a href="#" className="hover:underline">Meta Verified</a>
                </div>
                <p className="mt-4 uppercase">© 2024 IdeaX from Meta</p>
            </footer>

        </aside>
    );
};


import React, { useMemo } from 'react';
import { User, Post } from '../types';

const StoryItem: React.FC<{ user: User, onClick: () => void }> = ({ user, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center flex-shrink-0 w-20 space-y-1">
        <div className="h-16 w-16 rounded-full p-0.5" style={{background: 'linear-gradient(45deg, #FDCB52, #FD8D32, #E22B5D, #C13584, #833AB4)'}}>
            <div className="bg-background p-0.5 rounded-full h-full w-full">
                <img src={user.avatarUrl} alt={user.displayName} className="h-full w-full object-cover rounded-full" />
            </div>
        </div>
        <p className="text-xs w-full truncate text-center">{user.username}</p>
    </button>
);


interface StoriesProps {
    posts: Post[];
    onOpenProfile: (user: User) => void;
}

export const Stories: React.FC<StoriesProps> = ({ posts, onOpenProfile }) => {
    
    const usersForStories = useMemo(() => {
        const uniqueUsers: User[] = [];
        const userIds = new Set<string>();
        for (const post of posts) {
            if (!userIds.has(post.author.id)) {
                uniqueUsers.push(post.author);
                userIds.add(post.author.id);
            }
            if (uniqueUsers.length >= 10) break;
        }
        return uniqueUsers;
    }, [posts]);

    return (
        <div className="hidden md:block w-full py-4 border-b border-border/50 overflow-hidden">
            <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar px-4">
                {usersForStories.map(user => (
                    <StoryItem key={user.id} user={user} onClick={() => onOpenProfile(user)} />
                ))}
            </div>
        </div>
    );
};


import React, { useMemo } from 'react';
import { Post, User } from '../types';
import { FeedItem } from './FeedItem';
import { Loader2, Video } from 'lucide-react';

interface ReelsPageProps {
    posts: Post[];
    loading: boolean;
    onOpenProfile: (user: User) => void;
}

export const ReelsPage: React.FC<ReelsPageProps> = ({ posts, loading, onOpenProfile }) => {
    
    const reelPosts = useMemo(() => posts.filter(p => p.is_reel), [posts]);

    if (loading && posts.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-lg">Loading reels...</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full w-full">
            <div className="hidden md:block p-4 border-b border-border/50">
                 <h1 className="text-2xl font-bold">Reels</h1>
            </div>
            {reelPosts.length > 0 ? (
                <div className="flex-1 w-full overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar">
                    {reelPosts.map((post) => (
                        <div 
                            key={post.id} 
                            className="h-full w-full snap-start flex-shrink-0"
                        >
                            <FeedItem post={post} onOpenProfile={onOpenProfile} />
                        </div>
                    ))}
                </div>
            ) : (
                !loading && (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <Video size={48} />
                        <h2 className="mt-4 text-xl font-bold">No Reels Yet</h2>
                        <p>Come back later or create your own reel!</p>
                    </div>
                )
            )}
        </div>
    );
};

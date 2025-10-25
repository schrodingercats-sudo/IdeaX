
import React, { useState, useRef, useCallback } from 'react';
import { Post, User } from '../types';
import { FeedItem } from './FeedItem';
import { Loader2 } from 'lucide-react';

interface FeedPageProps {
    posts: Post[];
    loading: boolean;
    loadMorePosts: () => Promise<void>;
    onOpenProfile: (user: User) => void;
}

export const FeedPage: React.FC<FeedPageProps> = ({ posts, loading, loadMorePosts, onOpenProfile }) => {
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    const handleLoadMore = useCallback(async () => {
        if (isFetchingMore) return;
        setIsFetchingMore(true);
        await loadMorePosts();
        setIsFetchingMore(false);
    }, [isFetchingMore, loadMorePosts]);

    const lastPostElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isFetchingMore) {
                handleLoadMore();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, isFetchingMore, handleLoadMore]);

    if (loading && posts.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-lg">Brewing fresh ideas...</p>
            </div>
        );
    }
    
    return (
        <div className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth">
            {posts.map((post, index) => (
                <div 
                    key={`${post.id}-${index}`} 
                    ref={index === posts.length - 1 ? lastPostElementRef : null}
                    className="h-full w-full snap-start flex-shrink-0"
                >
                    <FeedItem post={post} onOpenProfile={onOpenProfile} />
                </div>
            ))}
            {isFetchingMore && (
                 <div className="h-full w-full snap-start flex-shrink-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
            )}
        </div>
    );
};
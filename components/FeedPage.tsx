
import React, { useState, useRef, useCallback } from 'react';
import { Post, User } from '../types';
import { FeedItem } from './FeedItem';
import { Loader2 } from 'lucide-react';

interface FeedPageProps {
    posts: Post[];
    loading: boolean;
    loadMorePosts: () => Promise<void>;
    onOpenProfile: (user: User) => void;
    onStoriesVisibilityChange: (isVisible: boolean) => void;
}

export const FeedPage: React.FC<FeedPageProps> = ({ posts, loading, loadMorePosts, onOpenProfile, onStoriesVisibilityChange }) => {
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastScrollY = useRef(0);
    const isVisibleRef = useRef(true);

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

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const currentScrollY = e.currentTarget.scrollTop;
        const scrollThreshold = 10;

        if (Math.abs(currentScrollY - lastScrollY.current) < scrollThreshold) {
            return;
        }

        if (currentScrollY > lastScrollY.current && currentScrollY > 50) { // Scrolling down
            if (isVisibleRef.current) {
                onStoriesVisibilityChange(false);
                isVisibleRef.current = false;
            }
        } else if (currentScrollY < lastScrollY.current) { // Scrolling up
            if (!isVisibleRef.current) {
                onStoriesVisibilityChange(true);
                isVisibleRef.current = true;
            }
        }

        lastScrollY.current = currentScrollY;
    }, [onStoriesVisibilityChange]);

    if (loading && posts.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-lg">Brewing fresh ideas...</p>
            </div>
        );
    }
    
    return (
        <div onScroll={handleScroll} className="flex-1 w-full overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar">
            {posts.map((post, index) => (
                <div 
                    key={post.id} 
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
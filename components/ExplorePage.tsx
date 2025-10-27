import React, { useState, useMemo } from 'react';
import { Post, User } from '../types';
import { Search, Image, Video } from 'lucide-react';

interface ExplorePageProps {
    posts: Post[];
    onOpenProfile: (user: User) => void;
}

const PostGridItem: React.FC<{ post: Post; onClick: () => void }> = ({ post, onClick }) => {
    const displayUrl = post.coverMedia?.type === 'video' 
        ? post.coverMedia.thumbnail 
        : post.coverMedia?.url;

    return (
        <button 
            onClick={onClick}
            className="w-full aspect-square group relative cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-sm"
        >
            <div className="bg-secondary flex items-center justify-center text-center h-full w-full">
                {post.coverMedia && displayUrl ? (
                    <>
                        <div className="absolute top-2 right-2 z-10 bg-black/40 text-white/90 backdrop-blur-sm rounded-full p-1">
                            {post.coverMedia.type === 'video' ? <Video size={12} /> : <Image size={12} />}
                        </div>
                        <img 
                            key={displayUrl} 
                            src={displayUrl} 
                            alt={post.title} 
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                    </>
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-2">
                        <p className="text-xs font-semibold text-white line-clamp-4">{post.title}</p>
                    </div>
                )}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                     <p className="text-white text-xs font-bold line-clamp-2 [text-shadow:0_1px_2px_var(--tw-shadow-color)] shadow-black">{post.title}</p>
                </div>
            </div>
        </button>
    );
};


export const ExplorePage: React.FC<ExplorePageProps> = ({ posts, onOpenProfile }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const trendingTags = useMemo(() => {
        const tagCounts = posts.flatMap(p => p.tags).reduce((acc: Record<string, number>, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(tagCounts)
            // FIX: The `sort` method's callback parameters were destructured in a way that could confuse TypeScript's type inference.
            // Switched to index-based access on the array entries to ensure the values being subtracted are correctly typed as numbers.
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([tag]) => tag);
    }, [posts]);
    
    const filteredPosts = useMemo(() => {
        if (!searchQuery.trim()) return posts;
        const lowercasedQuery = searchQuery.toLowerCase();
        return posts.filter(post => 
            post.title.toLowerCase().includes(lowercasedQuery) ||
            post.summary.toLowerCase().includes(lowercasedQuery) ||
            post.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery)) ||
            post.author.displayName.toLowerCase().includes(lowercasedQuery)
        );
    }, [posts, searchQuery]);


    return (
        <div className="h-full w-full flex flex-col">
            {/* Desktop Header */}
            <div className="hidden md:block p-4 border-b border-border/50">
                 <h1 className="text-2xl font-bold">Explore</h1>
            </div>
            
            {/* Search (Shared) */}
            <div className="p-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search ideas, problems, users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-secondary pl-10 pr-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                    />
                </div>
            </div>

            {/* Trending Tags */}
            {!searchQuery.trim() && (
                 <div className="px-4 pb-4">
                    <h2 className="text-lg font-bold mb-3 hidden md:block">Trending Topics</h2>
                     <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
                        {trendingTags.map(tag => (
                             <button key={tag} onClick={() => setSearchQuery(tag)} className="flex-shrink-0 bg-secondary hover:bg-muted text-sm font-semibold px-4 py-2 rounded-lg capitalize transition-colors">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}
           
            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto px-1 no-scrollbar">
                <div className="grid grid-cols-3 gap-1">
                    {filteredPosts.map(post => (
                        <PostGridItem 
                            key={post.id} 
                            post={post} 
                            onClick={() => onOpenProfile(post.author)} 
                        />
                    ))}
                </div>
                 {filteredPosts.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p className="font-semibold">No results found</p>
                        <p className="text-sm">Try searching for something else.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

import React, { useState, useMemo, useRef } from 'react';
import { Post, User } from '../types';
import { Search, Image, Video } from 'lucide-react';

interface ExplorePageProps {
    posts: Post[];
    onOpenProfile: (user: User) => void;
}

const PostGridItem: React.FC<{ post: Post }> = ({ post }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        videoRef.current?.play().catch(() => {});
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };
    
    return (
        <div 
            className="w-full group relative cursor-pointer break-inside-avoid mb-1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="bg-secondary rounded-md overflow-hidden flex items-center justify-center text-center">
                {post.coverMedia ? (
                    <>
                        <div className="absolute top-2 right-2 z-10 bg-black/40 text-white/90 backdrop-blur-sm rounded-full p-1">
                            {post.coverMedia.type === 'video' ? <Video size={12} /> : <Image size={12} />}
                        </div>
                        {post.coverMedia.type === 'video' ? (
                            <video
                                ref={videoRef}
                                key={post.coverMedia.url}
                                src={post.coverMedia.url}
                                loop
                                muted
                                playsInline
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <img key={post.coverMedia.url} src={post.coverMedia.url} alt={post.title} className="h-full w-full object-cover" />
                        )}
                    </>
                ) : (
                    <div className="h-full w-full aspect-square flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-2">
                        <p className="text-xs font-semibold text-white line-clamp-4">{post.title}</p>
                    </div>
                )}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                     <p className="text-white text-xs font-bold line-clamp-2 [text-shadow:0_1px_2px_var(--tw-shadow-color)] shadow-black">{post.title}</p>
                </div>
            </div>
        </div>
    );
};


export const ExplorePage: React.FC<ExplorePageProps> = ({ posts }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const trendingTags = useMemo(() => {
        const tagCounts = posts.flatMap(p => p.tags).reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
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
        <div className="h-full w-full flex flex-col pt-16">
            {/* Header + Search */}
            <div className="px-4 pb-4">
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
                    <h2 className="text-lg font-bold mb-3">Trending Topics</h2>
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
            <div className="flex-1 overflow-y-auto px-1 pb-16">
                <div className="columns-3 gap-1">
                    {filteredPosts.map(post => (
                        <PostGridItem key={post.id} post={post} />
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
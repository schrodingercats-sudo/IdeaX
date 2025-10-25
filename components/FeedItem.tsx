import React, { useState, useRef, useEffect } from 'react';
import { Post, PostType, Stage, User } from '../types';
import { Heart, MessageCircle, Bookmark, Send, Briefcase, Tag, Target, MoreVertical } from 'lucide-react';

const typeColors: Record<PostType, string> = {
    [PostType.Problem]: 'bg-red-500/20 text-red-300 border-red-500/30',
    [PostType.Idea]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    [PostType.Solution]: 'bg-green-500/20 text-green-300 border-green-500/30',
    [PostType.Showcase]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const stageColors: Record<Stage, string> = {
    [Stage.Idea]: 'border-cyan-400/50',
    [Stage.Prototype]: 'border-teal-400/50',
    [Stage.MVP]: 'border-sky-400/50',
    [Stage.Launched]: 'border-indigo-400/50',
    [Stage.PMF]: 'border-purple-400/50',
};

const StatPill: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <div className="flex items-center text-xs bg-black/30 text-white/80 backdrop-blur-sm rounded-full px-2.5 py-1">
        {icon}
        <span className="ml-1.5 font-medium">{label}</span>
    </div>
);

const formatStat = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}m`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
};

interface FeedItemProps {
    post: Post;
    onOpenProfile: (user: User) => void;
}

export const FeedItem: React.FC<FeedItemProps> = ({ post, onOpenProfile }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [likeCount, setLikeCount] = useState(post.stats.likes);

    const [isExpanded, setIsExpanded] = useState(false);
    const [canExpand, setCanExpand] = useState(false);
    const summaryRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const element = summaryRef.current;
        if (element) {
            // Check if the text is overflowing its container, which means it's being clamped.
            if (element.scrollHeight > element.clientHeight) {
                setCanExpand(true);
            } else {
                setCanExpand(false);
            }
        }
    }, [post.summary]);
    
    // Reset expanded state when scrolling to a new post
    useEffect(() => {
        setIsExpanded(false);
    }, [post.id]);


    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        console.log(isLiked ? 'Unliked post' : 'Liked post', post.id);
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
        console.log(isSaved ? 'Unsaved post' : 'Saved post', post.id);
    };

    const handleFollow = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening profile when following
        setIsFollowing(!isFollowing);
        console.log(isFollowing ? `Unfollowed ${post.author.username}` : `Followed ${post.author.username}`);
    };

    return (
        <div className="relative h-full w-full text-white">
            {post.coverMedia ? (
                post.coverMedia.type === 'video' ? (
                    <video
                        key={post.id} // Important for re-rendering when the video source changes
                        src={post.coverMedia.url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <img src={post.coverMedia.url} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
                )
            ) : (
                <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900"></div>
            )}
            <div className={`absolute inset-0 transition-all duration-300 ease-in-out ${isExpanded ? 'bg-black/40 backdrop-blur-sm' : 'bg-gradient-to-t from-black/80 via-black/40 to-transparent'}`}></div>
            
            {/* Content Area (Left side) */}
            <div className="absolute bottom-20 left-0 right-0 p-4 pr-20 space-y-3 md:bottom-12 md:p-6 md:pr-8">
                <div className="flex items-center space-x-3">
                    <button onClick={() => onOpenProfile(post.author)} className="flex items-center space-x-3 text-left">
                        <img src={post.author.avatarUrl} alt={post.author.displayName} className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-white/50 object-cover" />
                        <div>
                            <p className="font-bold text-base md:text-lg">{post.author.displayName}</p>
                            <p className="text-xs md:text-sm text-white/80 -mt-0.5">@{post.author.username}</p>
                        </div>
                    </button>
                    <button 
                        onClick={handleFollow}
                        className={`ml-auto font-semibold text-sm px-3 py-1 md:px-4 md:py-1.5 rounded-lg transition-colors ${isFollowing ? 'bg-white/20 text-white' : 'bg-primary text-background hover:bg-white/90'}`}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                </div>

                <h2 className="text-xl md:text-2xl font-extrabold leading-tight shadow-black [text-shadow:0_2px_4px_var(--tw-shadow-color)]">{post.title}</h2>
                
                <div>
                    <p ref={summaryRef} className={`text-white/90 text-sm md:text-base leading-relaxed transition-all duration-300 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                        {post.summary}
                    </p>
                    {canExpand && (
                         <button onClick={() => setIsExpanded(!isExpanded)} className="text-muted-foreground font-semibold text-sm hover:text-white mt-1">
                           {isExpanded ? 'Show less' : '...more'}
                        </button>
                    )}
                    {(!canExpand || isExpanded) && (
                        <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
                            <div className={`flex items-center text-xs border rounded-full px-2.5 py-1 capitalize ${typeColors[post.type]}`}>
                                <Target size={12} className="mr-1.5" /> {post.type}
                            </div>
                            {post.industries.map(industry => (
                                <StatPill key={industry} icon={<Briefcase size={12} />} label={industry} />
                            ))}
                            {post.tags.slice(0, 2).map(tag => (
                                <StatPill key={tag} icon={<Tag size={12} />} label={tag} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Actions Area (Right side) */}
            <div className="absolute right-3 md:right-4 bottom-20 flex flex-col items-center space-y-2 md:bottom-12">
                <div className="flex flex-col items-center">
                    <button onClick={handleLike} className="bg-black/40 p-2 rounded-full backdrop-blur-sm transform active:scale-90 transition-transform">
                        <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                    </button>
                    <span className="text-xs font-bold mt-1">{formatStat(likeCount)}</span>
                </div>
                <div className="flex flex-col items-center">
                    <button onClick={() => console.log('Comment on post', post.id)} className="bg-black/40 p-2 rounded-full backdrop-blur-sm transform active:scale-90 transition-transform">
                        <MessageCircle className="w-6 h-6" />
                    </button>
                    <span className="text-xs font-bold mt-1">{formatStat(post.stats.comments)}</span>
                </div>
                <div className="flex flex-col items-center">
                    <button onClick={handleSave} className="bg-black/40 p-2 rounded-full backdrop-blur-sm transform active:scale-90 transition-transform">
                        <Bookmark className={`w-6 h-6 transition-colors ${isSaved ? 'text-yellow-400 fill-current' : ''}`} />
                    </button>
                    <span className="text-xs font-bold mt-1">{formatStat(post.stats.saves)}</span>
                </div>
                <div className="flex flex-col items-center">
                    <button onClick={() => console.log('Share post', post.id)} className="bg-black/40 p-2 rounded-full backdrop-blur-sm transform active:scale-90 transition-transform">
                        <Send className="w-6 h-6" />
                    </button>
                    <span className="text-xs font-bold mt-1">{formatStat(post.stats.shares)}</span>
                </div>
                <div className="flex flex-col items-center">
                    <button onClick={() => console.log('More options for post', post.id)} className="bg-black/40 p-2 rounded-full backdrop-blur-sm transform active:scale-90 transition-transform">
                        <MoreVertical className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};
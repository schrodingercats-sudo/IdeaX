import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
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
    const videoRef = useRef<HTMLVideoElement>(null);

    useLayoutEffect(() => {
        // Reset states for a new post to ensure correct initial rendering
        setIsExpanded(false);
        setCanExpand(false);

        const element = summaryRef.current;
        if (!element) return;

        // Check if the summary text is overflowing its container after it has rendered.
        // This determines whether the "...more" button is needed.
        const checkOverflow = () => {
            const isClamped = element.scrollHeight > element.clientHeight;
            setCanExpand(isClamped);
        };
        
        // We use a minimal timeout to ensure the browser has painted and calculated
        // the layout, especially with dynamic content. This is more reliable than
        // checking immediately.
        const timerId = setTimeout(checkOverflow, 50);

        const resizeObserver = new ResizeObserver(() => {
            // On resize, only re-evaluate for clamping if the text is collapsed.
            // This prevents the "Show less" button from disappearing if the window
            // is made wider while the text is expanded.
            const isCurrentlyCollapsed = element.classList.contains('line-clamp-2');
            if (isCurrentlyCollapsed) {
                checkOverflow();
            }
        });

        resizeObserver.observe(element);

        // Cleanup function
        return () => {
            clearTimeout(timerId);
            resizeObserver.disconnect();
        };
    }, [post.id]); // Re-run this effect only when the post changes

    
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    const playPromise = videoElement.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.warn(`Autoplay for video ${post.id} was prevented.`, error);
                        });
                    }
                } else {
                    videoElement.pause();
                    videoElement.currentTime = 0;
                }
            },
            {
                threshold: 0.75,
            }
        );

        observer.observe(videoElement);

        return () => {
            if (videoElement) {
                observer.unobserve(videoElement);
            }
        };
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
        e.stopPropagation();
        setIsFollowing(!isFollowing);
        console.log(isFollowing ? `Unfollowed ${post.author.username}` : `Followed ${post.author.username}`);
    };

    return (
        <div className="relative h-full w-full text-white">
            {post.coverMedia ? (
                post.coverMedia.type === 'video' ? (
                    <video
                        ref={videoRef}
                        key={post.coverMedia.url}
                        src={post.coverMedia.url}
                        poster={post.coverMedia.thumbnail}
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
            <div className="absolute bottom-4 left-0 right-0 p-4 pr-20 space-y-3 md:bottom-12 md:p-6 md:pr-8">
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
                        className={`ml-auto font-semibold text-sm px-3 py-1 md:px-4 md:py-1.5 rounded-lg transition-colors ${isFollowing ? 'bg-white/20 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
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
                    <div className={`flex flex-wrap gap-2 mt-3 ${canExpand && !isExpanded ? 'hidden' : 'animate-fade-in'}`}>
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
                </div>
            </div>

            {/* Actions Area (Right side) */}
            <div className="absolute right-3 md:right-4 bottom-4 flex flex-col items-center space-y-2 md:bottom-12">
                <div className="flex flex-col items-center">
                    <button onClick={handleLike} className="bg-black/40 p-2 rounded-full backdrop-blur-sm transform active:scale-90 transition-transform" aria-label={isLiked ? 'Unlike post' : 'Like post'}>
                        <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                    </button>
                    <span className="text-xs font-bold mt-1">{formatStat(likeCount)}</span>
                </div>
                <div className="flex flex-col items-center">
                    <button onClick={() => console.log('Comment on post', post.id)} className="bg-black/40 p-2 rounded-full backdrop-blur-sm transform active:scale-90 transition-transform" aria-label="Comment on post">
                        <MessageCircle className="w-6 h-6" />
                    </button>
                    <span className="text-xs font-bold mt-1">{formatStat(post.stats.comments)}</span>
                </div>
                <div className="flex flex-col items-center">
                    <button onClick={handleSave} className="bg-black/40 p-2 rounded-full backdrop-blur-sm transform active:scale-90 transition-transform" aria-label={isSaved ? 'Unsave post' : 'Save post'}>
                        <Bookmark className={`w-6 h-6 transition-colors ${isSaved ? 'text-yellow-400 fill-current' : ''}`} />
                    </button>
                    <span className="text-xs font-bold mt-1">{formatStat(post.stats.saves)}</span>
                </div>
                <div className="flex flex-col items-center">
                    <button onClick={() => console.log('Share post', post.id)} className="bg-black/40 p-2 rounded-full backdrop-blur-sm transform active:scale-90 transition-transform" aria-label="Share post">
                        <Send className="w-6 h-6" />
                    </button>
                    <span className="text-xs font-bold mt-1">{formatStat(post.stats.shares)}</span>
                </div>
                <div className="flex flex-col items-center">
                    <button onClick={() => console.log('More options for post', post.id)} className="bg-black/40 p-2 rounded-full backdrop-blur-sm transform active:scale-90 transition-transform" aria-label="More options">
                        <MoreVertical className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};
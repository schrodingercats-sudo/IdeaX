
import React, { useState, useEffect, useRef } from 'react';
import { User, Post, Highlight } from '../types';
import { ChevronLeft, MoreHorizontal, Grid, Video, Bookmark, Plus, Send } from 'lucide-react';

const Stat: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <p className="font-bold text-lg">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

interface UserProfilePageProps {
  user: User;
  currentUser: User;
  posts: Post[];
  onClose: () => void;
  onLogout: () => void;
  onOpenEditProfile: () => void;
  onStartConversation: (user: User) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, currentUser, posts, onClose, onLogout, onOpenEditProfile, onStartConversation }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isCurrentUser = user.id === currentUser.id;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    setIsMenuOpen(false);
    onLogout();
  };
  
  const handleEditProfile = () => {
    setIsMenuOpen(false);
    onOpenEditProfile();
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    console.log(isFollowing ? `Unfollowed ${user.username}` : `Followed ${user.username}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="grid grid-cols-3 gap-1">
            {posts.map(post => (
              <div key={post.id} className="aspect-square bg-secondary rounded-sm overflow-hidden flex items-center justify-center p-2 text-center">
                {post.coverMedia ? (
                  <img src={post.coverMedia.type === 'video' ? post.coverMedia.thumbnail || post.coverMedia.url : post.coverMedia.url} alt={post.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-2">
                    <p className="text-xs font-semibold text-white line-clamp-4">{post.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'reels':
        return <div className="text-center py-10 text-muted-foreground">Reels coming soon!</div>;
      case 'saved':
         if (!isCurrentUser) return <div className="text-center py-10 text-muted-foreground">Saved posts are private.</div>;
        return <div className="text-center py-10 text-muted-foreground">Your saved posts will appear here.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-background flex flex-col animate-fade-in">
      <header className="flex items-center justify-between p-4 border-b border-border relative">
        <button
          onClick={onClose}
          className="p-2 rounded-full text-foreground hover:bg-secondary transition-colors"
          aria-label="Close profile"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
            <h2 className="text-lg font-bold">{user.displayName}</h2>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
        <div className="w-10">
          {isCurrentUser && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full text-foreground hover:bg-secondary transition-colors"
                aria-label="Profile options"
              >
                <MoreHorizontal size={24} />
              </button>
              {isMenuOpen && (
                 <div className="absolute right-0 mt-2 w-40 bg-secondary rounded-lg shadow-lg border border-border z-20 py-1 animate-fade-in">
                   <button 
                     onClick={handleEditProfile} 
                     className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                   >
                     Edit Profile
                   </button>
                   <button 
                     onClick={handleLogout} 
                     className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted"
                   >
                     Log Out
                   </button>
                 </div>
              )}
            </div>
          )}
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-6 flex flex-col items-center">
          <img src={user.avatarUrl} alt={user.displayName} className="h-24 w-24 rounded-full border-4 border-secondary object-cover" />
          <div className="flex items-center gap-4 mt-4">
            <Stat value={user.postCount} label="Posts" />
            <Stat value={user.followerCount} label="Followers" />
            <Stat value={user.followingCount} label="Following" />
          </div>
          <p className="text-center mt-4 max-w-md text-foreground/90">{user.bio}</p>
          {!isCurrentUser && (
            <div className="flex items-center gap-2 mt-4">
                <button 
                  onClick={handleFollow}
                  className={`px-6 py-2 font-semibold rounded-lg transition-colors ${isFollowing ? 'bg-secondary text-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button 
                  onClick={() => onStartConversation(user)}
                  className="px-6 py-2 font-semibold rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors"
                >
                  Message
                </button>
            </div>
          )}
        </div>
        
        {user.highlights && user.highlights.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex items-center space-x-4 overflow-x-auto pb-2 no-scrollbar">
              {isCurrentUser && (
                <div className="flex flex-col items-center flex-shrink-0 w-20">
                  <button className="h-16 w-16 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-foreground transition-colors">
                    <Plus size={24} />
                  </button>
                  <span className="text-xs mt-2 font-medium">New</span>
                </div>
              )}
              {user.highlights.map(highlight => (
                <div key={highlight.id} className="flex flex-col items-center flex-shrink-0 w-20">
                  <div className="h-16 w-16 rounded-full p-0.5" style={{background: 'linear-gradient(45deg, #FDCB52, #FD8D32, #E22B5D, #C13584, #833AB4)'}}>
                    <div className="bg-background p-0.5 rounded-full">
                      <img src={highlight.coverUrl} alt={highlight.title} className="h-full w-full object-cover rounded-full" />
                    </div>
                  </div>
                  <span className="text-xs mt-2 font-medium truncate w-full text-center">{highlight.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border flex justify-around">
          <button onClick={() => setActiveTab('posts')} className={`flex-1 py-3 flex justify-center border-b-2 ${activeTab === 'posts' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'} transition-colors`}>
            <Grid />
          </button>
          <button onClick={() => setActiveTab('reels')} className={`flex-1 py-3 flex justify-center border-b-2 ${activeTab === 'reels' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'} transition-colors`}>
            <Video />
          </button>
          <button onClick={() => setActiveTab('saved')} className={`flex-1 py-3 flex justify-center border-b-2 ${activeTab === 'saved' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'} transition-colors`}>
            <Bookmark />
          </button>
        </div>
        
        <div className="px-1 pt-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
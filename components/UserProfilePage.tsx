import React, { useState } from 'react';
import { User, Post, Highlight } from '../types';
import { ChevronLeft, MoreHorizontal, Grid, Video, Bookmark, Plus } from 'lucide-react';

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
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, currentUser, posts, onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isCurrentUser = user.id === currentUser.id;

  const handleLogout = () => {
    setIsMenuOpen(false);
    onLogout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="grid grid-cols-3 gap-1">
            {posts.map(post => (
              <div key={post.id} className="aspect-square bg-secondary rounded-sm overflow-hidden flex items-center justify-center p-2 text-center">
                {post.coverMedia ? (
                  <img src={post.coverMedia.url} alt={post.title} className="h-full w-full object-cover" />
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
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full text-foreground hover:bg-secondary transition-colors"
                aria-label="Profile options"
              >
                <MoreHorizontal size={24} />
              </button>
              {isMenuOpen && (
                 <div className="absolute right-0 mt-2 w-40 bg-secondary rounded-lg shadow-lg border border-border z-20 py-1">
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
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 flex flex-col items-center">
          <img src={user.avatarUrl} alt={user.displayName} className="h-24 w-24 rounded-full border-4 border-secondary object-cover" />
          <div className="flex items-center gap-4 mt-4">
            <Stat value={user.postCount} label="Posts" />
            <Stat value={user.followerCount} label="Followers" />
            <Stat value={user.followingCount} label="Following" />
          </div>
          <p className="text-center mt-4 max-w-md text-foreground/90">{user.bio}</p>
          <button className="mt-4 px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary/90 transition-colors">
            {isCurrentUser ? 'Edit Profile' : 'Follow'}
          </button>
        </div>
        
        {/* Highlights Section */}
        {user.highlights && user.highlights.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex items-center space-x-4 overflow-x-auto pb-2">
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
                  <div className="h-16 w-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
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

        {/* Tabs Section */}
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
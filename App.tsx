
import React, { useState, useEffect, useCallback } from 'react';
import { FeedPage } from './components/FeedPage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CreatePostPage } from './components/CreatePostPage';
import { UserProfilePage } from './components/UserProfilePage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { Post, User, PostFormData, Page } from './types';
import { generateFeedContent } from './services/geminiService';
import { ExplorePage } from './components/ExplorePage';
import { SplashScreen } from './components/SplashScreen';

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('feed');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [viewingProfileUser, setViewingProfileUser] = useState<User | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppReady(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => {
    setCurrentUser(null);
    setAuthPage('login');
  };
  const handleSignUp = (user: User) => setCurrentUser(user);


  const loadInitialPosts = async () => {
    setLoading(true);
    const newPosts = await generateFeedContent();
    setPosts(newPosts);
    setLoading(false);
  };
  
  useEffect(() => {
    if (currentUser) {
      loadInitialPosts();
    }
  }, [currentUser?.id]); // FIX: Depend on user ID, not the whole object.

  const loadMorePosts = useCallback(async () => {
      const newPosts = await generateFeedContent();
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
  }, []);

  const handleCreatePost = (formData: PostFormData) => {
    if (!currentUser) return;

    const newPost: Post = {
      id: `post-${Date.now()}-${Math.random()}`,
      author: currentUser,
      type: formData.type,
      title: formData.title,
      summary: formData.summary,
      content_md: formData.content_md,
      tags: formData.tags,
      industries: formData.industries,
      stage: formData.stage,
      difficulty: formData.difficulty,
      potential_impact: formData.potential_impact,
      is_reel: formData.is_reel,
      stats: {
        likes: 0,
        comments: 0,
        saves: 0,
        shares: 0,
      },
    };

    if (formData.coverMedia) {
      newPost.coverMedia = {
        type: formData.coverMedia.type.startsWith('video/') ? 'video' : 'image',
        url: URL.createObjectURL(formData.coverMedia),
      };
    }

    if (formData.additionalMedia && formData.additionalMedia.length > 0) {
        newPost.additionalMedia = formData.additionalMedia.map(file => ({
            type: file.type.startsWith('video/') ? 'video' : 'image',
            url: URL.createObjectURL(file),
        }));
    }

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setCurrentUser(prevUser => {
        if (!prevUser) return null;
        return {
            ...prevUser,
            postCount: prevUser.postCount + 1,
        };
    });
    setIsCreatingPost(false);
  };

  const openProfile = (user: User) => setViewingProfileUser(user);
  const closeProfile = () => setViewingProfileUser(null);

  if (!isAppReady) {
    return <SplashScreen />;
  }

  if (!currentUser) {
    if (authPage === 'login') {
      return <LoginPage onLoginSuccess={handleLogin} onSwitchToSignUp={() => setAuthPage('signup')} />;
    }
    return <SignUpPage onSignUpSuccess={handleSignUp} onSwitchToLogin={() => setAuthPage('login')} />;
  }

  return (
    <div className="bg-background text-foreground h-screen w-screen overflow-hidden flex flex-col font-sans">
      <Header onOpenProfile={openProfile} currentUser={currentUser} />
      <main className="flex-1 overflow-hidden">
        {currentPage === 'feed' && (
            <FeedPage 
              posts={posts} 
              loading={loading}
              loadMorePosts={loadMorePosts}
              onOpenProfile={openProfile}
            />
        )}
        {currentPage === 'explore' && (
            <ExplorePage posts={posts} onOpenProfile={openProfile} />
        )}
      </main>
      <BottomNav 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenCreatePost={() => setIsCreatingPost(true)}
        onOpenProfile={openProfile}
        currentUser={currentUser}
      />
      {isCreatingPost && <CreatePostPage onClose={() => setIsCreatingPost(false)} onCreatePost={handleCreatePost} />}
      {viewingProfileUser && 
        <UserProfilePage 
          user={viewingProfileUser} 
          currentUser={currentUser}
          posts={posts.filter(p => p.author.id === viewingProfileUser.id)}
          onClose={closeProfile} 
          onLogout={handleLogout}
        />
      }
    </div>
  );
}

export default App;

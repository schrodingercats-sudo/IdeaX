
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FeedPage } from './components/FeedPage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CreatePostPage } from './components/CreatePostPage';
import { UserProfilePage } from './components/UserProfilePage';
import { EditProfilePage } from './components/EditProfilePage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { Post, User, PostFormData, Page, ProfileUpdateFormData, Conversation, Message } from './types';
import { generateFeedContent } from './services/geminiService';
import { ExplorePage } from './components/ExplorePage';
import { SplashScreen } from './components/SplashScreen';
import { fileToBase64, generateVideoThumbnail } from './utils/media';
import { SideNav } from './components/SideNav';
import { SuggestionsSidebar } from './components/SuggestionsSidebar';
import { Stories } from './components/Stories';
import { SearchPage } from './components/SearchPage';
import { MessagesPage } from './components/MessagesPage';
import { ReelsPage } from './components/ReelsPage';
import { NotificationsPage } from './components/NotificationsPage';

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('feed');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [viewingProfileUser, setViewingProfileUser] = useState<User | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isStoriesVisible, setIsStoriesVisible] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

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
  }, [currentUser?.id]);

  const loadMorePosts = useCallback(async () => {
      const newPosts = await generateFeedContent();
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
  }, []);

  const handleCreatePost = async (formData: PostFormData) => {
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
        const isVideo = formData.coverMedia.type.startsWith('video/');
        const fileUrl = await fileToBase64(formData.coverMedia);
        let thumbnailUrl: string | undefined = undefined;

        if (isVideo) {
            try {
                thumbnailUrl = await generateVideoThumbnail(formData.coverMedia);
            } catch (error) {
                console.error("Failed to generate video thumbnail:", error);
                thumbnailUrl = "https://via.placeholder.com/1080x1920.png?text=Thumbnail+Failed";
            }
        }

        newPost.coverMedia = {
            type: isVideo ? 'video' : 'image',
            url: fileUrl,
            thumbnail: thumbnailUrl,
        };
    }

    if (formData.additionalMedia && formData.additionalMedia.length > 0) {
        newPost.additionalMedia = await Promise.all(
            formData.additionalMedia.map(async (file) => ({
                type: file.type.startsWith('video/') ? 'video' : 'image',
                url: await fileToBase64(file),
            }))
        );
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
  
  const handleUpdateProfile = async (formData: ProfileUpdateFormData) => {
    if (!currentUser) return;

    let newAvatarUrl = formData.avatarUrl;
    if (formData.avatarFile) {
        try {
            newAvatarUrl = await fileToBase64(formData.avatarFile);
        } catch (error) {
            console.error("Failed to convert avatar to base64:", error);
            newAvatarUrl = currentUser.avatarUrl;
        }
    }
    
    const updatedUser = {
        ...currentUser,
        displayName: formData.displayName,
        username: formData.username,
        bio: formData.bio,
        avatarUrl: newAvatarUrl,
    };
    
    setCurrentUser(updatedUser);
    
    setPosts(prevPosts => prevPosts.map(post => {
        if (post.author.id === currentUser.id) {
            return { ...post, author: updatedUser };
        }
        return post;
    }));

    if (viewingProfileUser?.id === currentUser.id) {
        setViewingProfileUser(updatedUser);
    }
    
    setIsEditingProfile(false);
  };

  const openProfile = (user: User) => setViewingProfileUser(user);
  const closeProfile = () => setViewingProfileUser(null);

  const viewingUserPosts = useMemo(() => {
    if (!viewingProfileUser) return [];
    return posts.filter(p => p.author.id === viewingProfileUser.id);
  }, [posts, viewingProfileUser]);

  const handleStoriesVisibilityChange = useCallback((isVisible: boolean) => {
    setIsStoriesVisible(isVisible);
  }, []);

  const allUsers = useMemo(() => {
    if (!currentUser) return [];
    const userMap = new Map<string, User>();
    posts.forEach(post => {
        if (!userMap.has(post.author.id)) {
            userMap.set(post.author.id, post.author);
        }
    });
    if (!userMap.has(currentUser.id)) {
        userMap.set(currentUser.id, currentUser);
    }
    return Array.from(userMap.values());
  }, [posts, currentUser]);

  const handleSendMessage = (conversationId: string, text: string) => {
    if (!currentUser) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      timestamp: Date.now(),
      senderId: currentUser.id,
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      // FIX: The `.at()` method is not available in all JS environments. Replaced with `[arr.length - 1]` for wider compatibility.
      ).sort((a, b) => (b.messages[b.messages.length - 1]?.timestamp ?? 0) - (a.messages[a.messages.length - 1]?.timestamp ?? 0))
    );

    // Simulate a reply
    setTimeout(() => {
        const targetConversation = conversations.find(c => c.id === conversationId);
        const otherParticipant = targetConversation?.participants.find(p => p.id !== currentUser.id);
        if (otherParticipant) {
             const replyMessage: Message = {
                id: `msg-${Date.now()}-reply`,
                text: `Hey! Thanks for reaching out. That's a great point about "${text.substring(0, 15)}..."`,
                timestamp: Date.now(),
                senderId: otherParticipant.id,
            };
             setConversations(prev =>
                prev.map(conv =>
                    conv.id === conversationId
                    ? { ...conv, messages: [...conv.messages, replyMessage] }
                    : conv
                // FIX: The `.at()` method is not available in all JS environments. Replaced with `[arr.length - 1]` for wider compatibility.
                ).sort((a, b) => (b.messages[b.messages.length - 1]?.timestamp ?? 0) - (a.messages[a.messages.length - 1]?.timestamp ?? 0))
            );
        }
    }, 1500);
  };

  const handleStartConversation = (user: User) => {
    if (!currentUser || user.id === currentUser.id) return;
    
    const existingConversation = conversations.find(c => 
        c.participants.length === 2 && 
        c.participants.some(p => p.id === user.id)
    );

    if (existingConversation) {
        setActiveConversationId(existingConversation.id);
    } else {
        const newConversation: Conversation = {
            id: `conv-${currentUser.id}-${user.id}`,
            participants: [currentUser, user],
            messages: [],
        };
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
    }
    setCurrentPage('messages');
    setViewingProfileUser(null);
  };
  
  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);


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
    <div className="bg-background text-foreground h-screen w-screen overflow-hidden flex flex-col md:flex-row font-sans">
      <SideNav
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenCreatePost={() => setIsCreatingPost(true)}
        onOpenProfile={openProfile}
        currentUser={currentUser}
        isProfileActive={!!viewingProfileUser && viewingProfileUser.id === currentUser.id}
      />
      
      <div className="flex-1 flex flex-col md:flex-row md:justify-center overflow-hidden">
        <div className="flex-1 flex flex-col md:max-w-[470px] lg:max-w-[630px] border-r-0 md:border-r md:border-border/50">
          {currentPage === 'feed' && <Header onOpenProfile={openProfile} currentUser={currentUser} onNavigate={setCurrentPage} />}
          <main className="flex-1 overflow-hidden relative">
            {currentPage === 'feed' && (
                <div className="h-full flex flex-col">
                    <div className={`transition-all duration-300 ease-in-out ${isStoriesVisible ? 'max-h-40' : 'max-h-0'} overflow-hidden`}>
                      <Stories posts={posts} onOpenProfile={openProfile} />
                    </div>
                    <FeedPage 
                        posts={posts} 
                        loading={loading}
                        loadMorePosts={loadMorePosts}
                        onOpenProfile={openProfile}
                        onStoriesVisibilityChange={handleStoriesVisibilityChange}
                    />
                </div>
            )}
            {currentPage === 'explore' && <ExplorePage posts={posts} onOpenProfile={openProfile} />}
            {currentPage === 'reels' && <ReelsPage posts={posts} loading={loading} onOpenProfile={openProfile} />}
            {currentPage === 'notifications' && <NotificationsPage />}
            {currentPage === 'search' && <SearchPage users={allUsers} onStartConversation={handleStartConversation} />}
            {currentPage === 'messages' && 
                <MessagesPage
                    conversations={conversations}
                    activeConversation={activeConversation}
                    onSelectConversation={setActiveConversationId}
                    onSendMessage={handleSendMessage}
                    currentUser={currentUser}
                />
            }
          </main>
          <BottomNav 
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            onOpenCreatePost={() => setIsCreatingPost(true)}
            onOpenProfile={openProfile}
            currentUser={currentUser}
          />
        </div>
        
        <SuggestionsSidebar currentUser={currentUser} posts={posts} onOpenProfile={openProfile} />
      </div>

      {isCreatingPost && <CreatePostPage onClose={() => setIsCreatingPost(false)} onCreatePost={handleCreatePost} />}
      {viewingProfileUser && 
        <UserProfilePage 
          user={viewingProfileUser} 
          currentUser={currentUser}
          posts={viewingUserPosts}
          onClose={closeProfile} 
          onLogout={handleLogout}
          onOpenEditProfile={() => setIsEditingProfile(true)}
          onStartConversation={handleStartConversation}
        />
      }
      {isEditingProfile && currentUser &&
        <EditProfilePage 
            user={currentUser}
            onClose={() => setIsEditingProfile(false)}
            onSave={handleUpdateProfile}
        />
      }
    </div>
  );
}

export default App;

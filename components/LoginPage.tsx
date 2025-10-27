
import React, { useState } from 'react';
import { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onSwitchToSignUp: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = () => {
    const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_') || 'test_user';
    const displayName = username.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    const loggedInUser: User = {
      id: 'user-' + Date.now(),
      username: username,
      displayName: displayName,
      avatarUrl: `https://i.pravatar.cc/150?u=${username}`,
      bio: '',
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
      highlights: [],
    };
    onLoginSuccess(loggedInUser);
  };

  return (
    <div className="bg-background text-foreground h-screen w-screen flex flex-col items-center justify-center p-4 relative">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://fastly.picsum.photos/id/355/1920/1080.jpg?hmac=zWnl6aMHvU06IvXa6EA_ZMtQLeKOWAtqyRz4M7vX9cM"
          alt="Abstract background" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>
      <div className="relative z-10 w-full max-w-sm text-center">
        <h1 className="text-5xl font-bold tracking-tighter mb-2 text-white">Welcome Back!</h1>
        <p className="text-muted-foreground mb-8">Log in to your IdeaX account.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-secondary/80 text-foreground px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-shadow placeholder:text-muted-foreground"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-secondary/80 text-foreground px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-shadow placeholder:text-muted-foreground"
            required
          />
          <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors">
            Log In
          </button>
        </form>

        <p className="text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <button onClick={onSwitchToSignUp} className="font-semibold text-primary hover:underline">
                Sign Up
            </button>
        </p>
      </div>
    </div>
  );
};

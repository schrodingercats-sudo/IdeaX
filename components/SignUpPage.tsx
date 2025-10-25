
import React, { useState } from 'react';
import { User } from '../types';
import { Loader2, Camera, ChevronLeft } from 'lucide-react';
import { GoogleIcon } from './icons/GoogleIcon';
import { GitHubIcon } from './icons/GitHubIcon';


interface SignUpPageProps {
  onSignUpSuccess: (user: User) => void;
  onSwitchToLogin: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUpSuccess, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };
  
  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSocialSignUp = () => {
    // Simulate getting basic info from a social provider
    setDisplayName('Social User');
    setEmail('social.user@example.com');
    // Go to step 2 to complete the profile
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return; // Basic validation
    setIsLoading(true);
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: username.toLowerCase(),
      displayName,
      avatarUrl: avatarPreview || `https://i.pravatar.cc/150?u=${username}`,
      bio: '',
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
      highlights: [],
    };
    
    setIsLoading(false);
    onSignUpSuccess(newUser);
  };

  return (
    <div className="bg-background text-foreground h-screen w-screen flex flex-col items-center justify-center p-4 relative">
       <div className="absolute inset-0 z-0">
        <img 
          src="https://www.nasa.gov/sites/default/files/styles/full_width/public/thumbnails/image/as08-14-2383.jpg" 
          alt="Earth from the moon" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>
      <div className="relative z-10 w-full max-w-sm">
        {step === 1 && (
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl font-bold tracking-tighter text-white mb-2">Create Account</h1>
            <p className="text-muted-foreground mb-8">Join IdeaX today.</p>

            <div className="space-y-4">
              <button onClick={handleSocialSignUp} className="w-full flex items-center justify-center gap-3 bg-secondary/80 hover:bg-muted/80 transition-colors font-semibold py-3 px-4 rounded-lg">
                <GoogleIcon className="h-5 w-5" />
                Continue with Google
              </button>
              <button onClick={handleSocialSignUp} className="w-full flex items-center justify-center gap-3 bg-secondary/80 hover:bg-muted/80 transition-colors font-semibold py-3 px-4 rounded-lg">
                <GitHubIcon className="h-5 w-5" />
                Continue with GitHub
              </button>
            </div>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-xs text-muted-foreground">OR</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <form onSubmit={handleNextStep} className="space-y-4 text-left">
              <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-secondary/80 text-foreground px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-shadow placeholder:text-muted-foreground"
                required
              />
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
              <button 
                type="submit" 
                className="w-full bg-primary text-background font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Continue with Email
              </button>
            </form>
          </div>
        )}
        {step === 2 && (
           <div className="text-center animate-fade-in">
             <div className="flex items-center justify-center mb-4 relative">
                <button type="button" onClick={handlePrevStep} className="absolute left-0 p-2 text-muted-foreground hover:text-foreground">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold tracking-tighter text-white">Profile Setup</h1>
            </div>
             <p className="text-muted-foreground mb-8">Choose a username and profile picture.</p>
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="flex justify-center">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="w-32 h-32 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center relative group">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <Camera size={40} className="text-muted-foreground" />
                            )}
                             <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-semibold text-sm">Change</span>
                            </div>
                        </div>
                    </label>
                    <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-secondary/80 text-foreground px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-shadow placeholder:text-muted-foreground"
                required
              />
              <button 
                type="submit" 
                className="w-full bg-primary text-background font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Finish Sign Up'}
              </button>
            </form>
          </div>
        )}

        <p className="text-sm text-muted-foreground mt-6 text-center">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="font-semibold text-primary hover:underline">
                Log In
            </button>
        </p>
      </div>
    </div>
  );
};
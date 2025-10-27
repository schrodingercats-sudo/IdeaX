
import React, { useState } from 'react';
import { User, ProfileUpdateFormData } from '../types';
import { X, Check, Camera } from 'lucide-react';

interface EditProfilePageProps {
  user: User;
  onClose: () => void;
  onSave: (formData: ProfileUpdateFormData) => void;
}

export const EditProfilePage: React.FC<EditProfilePageProps> = ({ user, onClose, onSave }) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    onSave({
      displayName,
      username,
      bio,
      avatarFile,
      avatarUrl: avatarPreview,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col animate-fade-in">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <button
          onClick={onClose}
          className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Close edit profile"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold">Edit Profile</h2>
        <button
          onClick={handleSubmit}
          className="p-2 rounded-full text-primary hover:bg-secondary transition-colors"
          aria-label="Save changes"
        >
          <Check size={24} />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <div className="flex flex-col items-center space-y-4">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center relative group">
              <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover rounded-full" />
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={32} className="text-white" />
              </div>
            </div>
          </label>
          <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        
        <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="font-semibold mb-2 block text-sm">Display Name</label>
              <input 
                id="displayName" 
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-secondary px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="username" className="font-semibold mb-2 block text-sm">Username</label>
              <input 
                id="username" 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-secondary px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
              />
            </div>
             <div>
              <label htmlFor="bio" className="font-semibold mb-2 block text-sm">Bio</label>
              <textarea 
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full bg-secondary px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
              />
            </div>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { X } from 'lucide-react';
import { CreatePostForm } from './CreatePostForm';
import { PostFormData } from '../types';

interface CreatePostPageProps {
  onClose: () => void;
  onCreatePost: (formData: PostFormData) => void;
}

export const CreatePostPage: React.FC<CreatePostPageProps> = ({ onClose, onCreatePost }) => {
  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col animate-fade-in">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-xl font-bold">Create Post</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Close post creation"
        >
          <X size={24} />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <CreatePostForm onSubmitSuccess={onCreatePost} />
      </div>
    </div>
  );
};
